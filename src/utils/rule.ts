import { Team, Member } from '../api/LeaderboardData';

const allRankingFactors = ['total_point', 'case_number', 'avgerage', 'name'];
let winningFactor = 'total_point';

export function getValueOnFactor(item: any, factor?: string) {
	if (factor == null) {
		factor = winningFactor;
	}

	switch (winningFactor) {
		case 'total_point':
			return item.total_point;
		case 'case_number':
			return item.case_number;
		case 'average':
			return item.case_number === 0 ? 0 : item.total_point / item.case_number;
		case 'name':
			return item.name;
		default:
			return;
	}
}

export function changeWinnerFactor(factor: string) {
	winningFactor = factor;
}

export function calculateAvgPoint(item: any) {
	let value = (item.case_number === 0) ? 0 : (item.total_point / item.case_number);

	return value.toFixed(1);
}

export function sortListRank(list: any[]) {
	let factors = allRankingFactors.slice().sort((a, b) => a === winningFactor ? -1 : 1);

	list.sort((a, b) => {
		for (let i = 0; i < factors.length; i++) {
			let fac = factors[i];
			let aVal = getValueOnFactor(a, fac);
			let bVal = getValueOnFactor(b, fac);

			if (aVal > bVal) return -1;
			if (aVal < bVal) return 1;
		}

		return 0;
	});
}

export function getMvpOwnerIds(teams: Team[]) {
	let maxScore = 0;
	let totalMemberCount = 0;
	let maxMvpScale = 0.1;
	let mvpOwnerIds: string[] = [];

	teams.forEach(t => {
		t.members.forEach(m => {
			let value = getValueOnFactor(m);
			if (maxScore < value) {
				maxScore = value;
				mvpOwnerIds = [m.id];
			}
			else if (maxScore == value) {
				mvpOwnerIds.push(m.id);
			}

			totalMemberCount++;
		});
	});

	if (mvpOwnerIds.length > totalMemberCount * maxMvpScale) {
		mvpOwnerIds = [];
	}

	return mvpOwnerIds;
}

// export function getMvpOwnerIds(teams: Team[]) {
// 	let bestTeamIndices: number[] = [];
// 	let maxValue: number = 0;
// 	let memberCount = 0;
// 	let mvpOwnerIds: string[] = [];

// 	teams.forEach((o, i) => {
// 		let value = getValueOnFactor(o);
// 		if (value > maxValue) {
// 			bestTeamIndices = [i];
// 			maxValue = value;
// 		}
// 		else if (value === maxValue) {
// 			bestTeamIndices.push(i);
// 		}
// 	});

// 	maxValue = 0;
// 	teams.forEach((t, i) => {
// 		if (bestTeamIndices.indexOf(i) === -1) return;

// 		t.members.forEach((m: Member) => {
// 			let value = getValueOnFactor(m);

// 			if (maxValue < value) {
// 				maxValue = value;
// 				mvpOwnerIds = [m.id];
// 			}
// 			else if (maxValue === value) {
// 				mvpOwnerIds.push(m.id);
// 			}

// 			memberCount++;
// 		});
// 	});

// 	if (mvpOwnerIds.length > memberCount / 10) {
// 		mvpOwnerIds = [];
// 	}

// 	return mvpOwnerIds;
// }
