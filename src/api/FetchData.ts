import { LeaderboardData } from './LeaderboardData';
import redsox from '../images/theme-baseball/red-sox.png';
import yankees from '../images/theme-baseball/yankees.png';
import themeIcon from '../images/theme-baseball/theme-icon.png';
import { intervalValidatorGenerator } from "../utils";
import { func } from 'prop-types';

/**
 * TODO: User should config theme associated resources.
 * The theme name may be the indentifier.
 */
const baseUrl = 'http://184.73.190.18/TF-Leaderboard-API/tf-leaderboard/';
// const baseUrl = 'http://dashboard.hq.transfinder.com/TF-Leaderboard-API/tf-leaderboard/';
// const baseUrl = 'http://localhost/TF-Leaderboard-API/tf-leaderboard/';
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
		.then(res => res.json())
		.then(res => {
			return res;
		});
}

export function fetchCaseData() {
	return fetch(`${baseUrl}casedata`)
		.then(res => res.json())
		.then(res => {
			return res;
		});
}

export function fetchImages() {
	return fetch(`${baseUrl}getimages/${templateId}`)
		.then(res => res.json())
		.then(res => {
			return res;
		});
}