import { LeaderboardData } from './LeaderboardData';
import redsox from '../images/theme-baseball/red-sox.png';
import yankees from '../images/theme-baseball/yankees.png';
import themeIcon from '../images/theme-baseball/theme-icon.png';
/**
 * TODO: User should config theme associated resources.
 * The theme name may be the indentifier.
 */
let themeName = "baseball";

let mock_data: LeaderboardData = {
	theme_name: themeName,
	theme_icon: themeIcon,
	teams: [
		{
			name: 'Yankees',
			color: '#004685',
			logo: yankees,
			stat: {
				case_number: 38,
				total_score: 103
			},
			members: [
				{
					first_name: 'Aaron',
					last_name: 'Juddge',
					picutre: '',
					stat: {
						case_number: 8,
						total_score: 24
					}
				},
				{
					first_name: 'Giancarlo',
					last_name: 'Stanton',
					picutre: '',
					stat: {
						case_number: 10,
						total_score: 25
					}
				},
				{
					first_name: 'Masahiro',
					last_name: 'Tanaka',
					picutre: '',
					stat: {
						case_number: 6,
						total_score: 16
					}
				},
				{
					first_name: 'Luke',
					last_name: 'Voit',
					picutre: '',
					stat: {
						case_number: 8,
						total_score: 18
					}
				},
				{
					first_name: 'Gio',
					last_name: 'Urshela',
					picutre: '',
					stat: {
						case_number: 6,
						total_score: 20
					}
				}
			]
		},
		{
			name: 'Red Sox',
			color: '#ec174b',
			logo: redsox,
			stat: {
				case_number: 25,
				total_score: 70
			},
			members: [
				{
					first_name: 'Chris',
					last_name: 'Sale',
					picutre: '',
					stat: {
						case_number: 6,
						total_score: 15
					}
				},
				{
					first_name: 'Mookie',
					last_name: 'Betts',
					picutre: '',
					stat: {
						case_number: 4,
						total_score: 12
					}
				},
				{
					first_name: 'Dustin',
					last_name: 'Pedroia',
					picutre: '',
					stat: {
						case_number: 6,
						total_score: 20
					}
				},
				{
					first_name: 'Michael',
					last_name: 'Chavis',
					picutre: '',
					stat: {
						case_number: 3,
						total_score: 10
					}
				},
				{
					first_name: 'David',
					last_name: 'Price',
					picutre: '',
					stat: {
						case_number: 6,
						total_score: 13
					}
				}
			]
		}
	]
};

export function fetchData() {
	return Promise.resolve(mock_data);
}