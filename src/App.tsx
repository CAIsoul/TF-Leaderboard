import React, { Component } from 'react';
import { Team, Configuration } from './api/LeaderboardData';
import { fetchTemplateSetting, fetchCaseData, fetchImages, updateConfiguration } from './api/FetchData';
import { get as getSetting, refresh as refreshConfiguration } from './utils/setting';
import { changeWinnerFactor, getWinningLabel } from './utils/rule';
import Header from './components/Header';
import Leaderboard from './components/Leaderboard';
import StatCarousel from './components/StatCarousel';
import './styles/App.scss';

interface Props {

}

interface State {
	title: string;
	template_name: string;
	template_icon: string;
	teams: Team[];
	carouselInterval: number;
	refreshInterval: number;
	expectation: number;
	startDate: string;
	endDate: string;
	winningCondition: string;
}

const DEFAULT_REFRESH_INTERVAL = 30;

export default class App extends Component<Props, State> {
	private carouselTimerId: NodeJS.Timeout | null;
	private refreshDataTimerId: NodeJS.Timeout | null;

	constructor(props: object) {
		super(props);
		this.carouselTimerId = null;
		this.refreshDataTimerId = null;

		this.state = {
			title: '',
			template_name: '',
			template_icon: '',
			teams: [],
			carouselInterval: 0,
			refreshInterval: DEFAULT_REFRESH_INTERVAL,
			expectation: 0,
			startDate: '',
			endDate: '',
			winningCondition: ''
		};
	}

	componentWillMount() {
		this.loadConfiguration()
			.then(() => {
				this.applyLeaderboardTemplate();
			});
	}

	loadConfiguration() {
		return refreshConfiguration()
			.then(() => {
				const title: any = getSetting('leaderboard-title');
				const carouselInterval: any = getSetting('carousel-interval');
				const startDate: any = getSetting('start-date');
				const endDate: any = getSetting('end-date');
				const expectation: any = getSetting('score-expectation');
				const winningCondition: any = getSetting('winning-condition');

				changeWinnerFactor(winningCondition);

				this.setState({
					title: title,
					carouselInterval: carouselInterval,
					expectation: expectation,
					startDate: startDate,
					endDate: endDate,
					winningCondition: winningCondition
				});

			})
	}

	applyLeaderboardTemplate() {
		fetchTemplateSetting()
			.then((res: any) => {
				let { name, teams } = res;

				this.setState({
					template_name: name,
					teams: teams
				});

				fetchImages()
					.then((imageData: any) => {
						let icon = imageData.icon;
						let teamLogos = imageData.teams;

						teams.forEach((o: any) => {
							o.logo = teamLogos[o.name];
						});

						this.setState({
							template_icon: icon,
							teams: teams
						});

						this.startRefreshData();
					});
			});
	}

	readLeaderboardData(startDate: string, endDate: string) {
		fetchCaseData(startDate, endDate)
			.then((res: any) => {
				let { teams } = this.state;

				teams.forEach(t => {
					t.case_number = 0;
					t.total_point = 0;

					t.members.forEach(m => {
						const stat = res[m.id];

						if (!stat) {
							m.case_number = 0;
							m.total_point = 0;
						}
						else {
							m.case_number = stat.case_number;
							m.total_point = stat.total_point;

							t.case_number += stat.case_number;
							t.total_point += stat.total_point;
						}
					})
				})

				this.setState({ teams: teams });
			});
	}

	startRefreshData(startDate?: string, endDate?: string) {

		if (startDate == null) {
			startDate = this.state.startDate;
		}

		if (endDate == null) {
			endDate = this.state.endDate;
		}

		this.readLeaderboardData(startDate, endDate);

		this.refreshDataTimerId = setTimeout(() => {

			this.startRefreshData(startDate, endDate);

		}, this.state.refreshInterval * 1000);
	}

	onSettingsUpdate(settings: Configuration) {
		let { carouselInterval, winningCondition, title, startDate, endDate, expectation } = this.state;
		let dateRangeModified = (settings.startDate !== startDate || settings.endDate !== endDate);
		let carouselIntervalModified = settings.carouselInterval !== carouselInterval;
		let winningConditionModified = settings.winningCondition !== winningCondition;


		if (settings.boardTitle === title
			&& settings.scoreExpectation === expectation
			&& !winningConditionModified
			&& !carouselIntervalModified
			&& !dateRangeModified) return;

		let newConfig: Configuration = {
			carouselInterval: settings.carouselInterval,
			boardTitle: settings.boardTitle,
			winningCondition: settings.winningCondition,
			scoreExpectation: settings.scoreExpectation,
			startDate: settings.startDate,
			endDate: settings.endDate
		};

		this.setState({
			carouselInterval: settings.carouselInterval,
			title: settings.boardTitle,
			winningCondition: settings.winningCondition,
			expectation: settings.scoreExpectation,
			startDate: settings.startDate,
			endDate: settings.endDate
		});

		updateConfiguration(newConfig);

		// saveSetting('leaderboard-title', settings.title.toString());
		// saveSetting('score-expectation', settings.expectation.toString());

		if (carouselIntervalModified) {
			// saveSetting('carousel-interval', settings.interval.toString());
			this.setTimer();
		}

		if (dateRangeModified) {
			// saveSetting('start-date', settings.startDate.toString());
			// saveSetting('end-date', settings.endDate.toString());

			if (this.refreshDataTimerId !== null) {
				clearTimeout(this.refreshDataTimerId);
				this.startRefreshData(settings.startDate, settings.endDate);
			}
		}

		if (winningConditionModified) {
			changeWinnerFactor(settings.winningCondition);
		}
	}

	clearTimer() {
		if (this.carouselTimerId !== null) {
			clearInterval(this.carouselTimerId);
		}
	}

	setTimer() {
		this.clearTimer();
	}

	render() {
		let { title, template_name, template_icon, teams, winningCondition,
			carouselInterval: interval, startDate, endDate, expectation } = this.state;
		let winningLabel = getWinningLabel();

		return (
			<div className="App">
				<Header boardTitle={title}
					winningCondition={winningCondition}
					carouselInterval={interval}
					scoreExpectation={expectation}
					startDate={startDate}
					endDate={endDate}
					onSettingsUpdate={(settings: Configuration) => {
						this.onSettingsUpdate(settings);
					}}
				/>
				<div className="main-content">
					<div className="overview-panel">
						<Leaderboard title={template_name}
							winningLabel={winningLabel}
							expectation={expectation}
							teams={teams}
							icon={template_icon}></Leaderboard>
					</div>
					<div className="detail-panel">
						<StatCarousel teams={teams} interval={interval}></StatCarousel>
					</div>
				</div>
			</div>
		);
	}
};