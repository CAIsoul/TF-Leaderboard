import { Configuration } from './LeaderboardData';
// import redsox from '../images/theme-baseball/red-sox.png';
// import yankees from '../images/theme-baseball/yankees.png';
// import themeIcon from '../images/theme-baseball/theme-icon.png';
// import { intervalValidatorGenerator } from "../utils";

/**
 * TODO: User should config theme associated resources.
 * The theme name may be the indentifier.
 */
// const baseUrl = 'http://184.73.190.18/TF-Leaderboard-API/tf-leaderboard/';
// const baseUrl = 'http://dashboard.hq.transfinder.com/TF-Leaderboard-API/tf-leaderboard/';
const baseUrl = 'http://localhost/TF-Leaderboard-API/tf-leaderboard/';
const templateId = 1;

// let mock_data: LeaderboardData = {
// 	name: "baseball",
// 	icon: themeIcon,
// 	teams: [
// 		{
// 			name: 'Yankees',
// 			color: '#004685',
// 			logo: yankees,
// 			case_number: 38,
// 			total_point: 103,
// 			members: [
// 				{
// 					name: 'Aaron Juddge',
// 					picutre: '',
// 					case_number: 8,
// 					total_point: 24
// 				},
// 				{
// 					name: 'Giancarlo Stanton',
// 					picutre: '',
// 					case_number: 10,
// 					total_point: 25
// 				},
// 				{
// 					name: 'Masahiro Tanaka',
// 					picutre: '',
// 					case_number: 6,
// 					total_point: 16
// 				},
// 				{
// 					name: 'Luke Voit',
// 					picutre: '',
// 					case_number: 8,
// 					total_point: 18
// 				},
// 				{
// 					name: 'Gio Urshela',
// 					picutre: '',
// 					case_number: 6,
// 					total_point: 20
// 				}
// 			]
// 		},
// 		{
// 			name: 'Red Sox',
// 			color: '#ec174b',
// 			logo: redsox,
// 			case_number: 25,
// 			total_point: 70,
// 			members: [
// 				{
// 					name: 'Chris Sale',
// 					picutre: '',
// 					case_number: 6,
// 					total_point: 15
// 				},
// 				{
// 					name: 'Mookie Betts',
// 					picutre: '',
// 					case_number: 4,
// 					total_point: 12
// 				},
// 				{
// 					name: 'Dustin Pedroia',
// 					picutre: '',
// 					case_number: 6,
// 					total_point: 20
// 				},
// 				{
// 					name: 'Michael Chavis',
// 					picutre: '',
// 					case_number: 3,
// 					total_point: 10
// 				},
// 				{
// 					name: 'David Price',
// 					picutre: '',
// 					case_number: 6,
// 					total_point: 13
// 				}
// 			]
// 		}
// 	]
// };

export function fetchTemplateSetting() {
	return fetch(`${baseUrl}template/${templateId}`)
		.then(res => res.json());
}

export function fetchCaseData(startDate: string, endDate: string) {
	return fetch(`${baseUrl}casedata?startDate=${startDate}&endDate=${endDate}`)
		.then(res => res.json());
}

export function fetchImages() {
	return fetch(`${baseUrl}getimages/${templateId}`)
		.then(res => res.json());
}

export function fetchConfiguration() {
	return fetch(`${baseUrl}getconfiguration`)
		.then(res => res.json())
		.then(res => {
			let config: Configuration = {
				boardTitle: res["BoardTitle"],
				carouselInterval: +res["CarouselInterval"],
				startDate: res["StartDate"],
				endDate: res["EndDate"],
				scoreExpectation: +res["ScoreExpectation"],
				winningCondition: res["WinningCondition"]
			};

			return config;
		});
}

export function updateConfiguration(config: Configuration) {
	const settings = {
		BoardTitle: config.boardTitle,
		CarouselInterval: config.carouselInterval.toString(),
		StartDate: config.startDate,
		EndDate: config.endDate,
		ScoreExpectation: config.scoreExpectation.toString(),
		WinningCondition: config.winningCondition
	};

	return fetch(`${baseUrl}saveconfiguration`, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(settings)
	});
}