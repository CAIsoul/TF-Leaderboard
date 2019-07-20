import { Team, Member } from '../api/LeaderboardData';

const winningFactors: any = {
	total_point: {
		label: 'Most Total Points Wins!',
		getValue: (item: any) => isNaN(item.total_point) ? 0 : item.total_point
	},
	case_number: {
		label: 'Most Case Numbers Wins!',
		getValue: (item: any) => isNaN(item.case_number) ? 0 : item.case_number
	},
	average: {
		label: 'Highest Average Point Wins!',
		getValue: (item: any) => !item.case_number ? 0 : item.total_point / item.case_number
	},
	name: {
		hidden: true,
		getValue: (item: any) => item.name
	}
};

let winningFactor = 'total_point';

/**
 * Get specified value in the object.
 * 
 * @param item member/team object
 * @param factor the field name 
 */
export function getValueOnFactor(item: any, factor?: string) {
	if (factor == null) factor = winningFactor;

	return winningFactors[factor].getValue(item);
}

/**
 * Change the winning factor.
 * 
 * @param factor new winning factor
 */
export function changeWinnerFactor(factor: string) {
	winningFactor = factor;
}

/**
 * Calculate the average poinmt 
 * 
 * @param item member/team object
 */
export function calculateAvgPoint(item: any) {
	let value = (item.case_number === 0) ? 0 : (item.total_point / item.case_number);

	return Math.floor(value * 100) / 100;
}

/**
 * Sort the given list by winning factor.
 * 
 * @param list list of member/team to be sorted
 */
export function sortListRank(list: any[]) {
	let factors = Object.keys(winningFactors).sort((a, b) => a === winningFactor ? -1 : 1);

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

/**
 * Get the ownerId of MVP among given teams.
 * 
 * @param teams 
 */
export function getMvpOwnerIds(teams: Team[]) {
	let maxScore = 0;
	let totalMemberCount = 0;
	let maxMvpScale = 0.1;
	let mvpOwnerIds: string[] = [];

	teams.forEach((t: Team) => {
		t.members.forEach((m: Member) => {
			let value = getValueOnFactor(m);
			if (maxScore < value) {
				maxScore = value;
				mvpOwnerIds = [m.id];
			}
			else if (maxScore === value) {
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

export function getWinningLabel() {
	return winningFactors[winningFactor].label;
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
