import React, { Component } from 'react';
import moment from 'moment';
import { Team } from './api/LeaderboardData';
import { fetchTemplateSetting, fetchCaseData, fetchImages } from './api/FetchData';
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
}


const dateFormat = "YYYY-MM-DD";
let today = moment();

const DEFAULT_TITLE = "Client Services - Summer: Week One";
const DEFAULT_REFRESH_INTERVAL = 30;
const DEFAULT_CAROUSEL_INTERVAL = 15;
const DEFAULT_EXPECTATION = 1000;
const DEFAULT_START_DATE = today.format(dateFormat);

today.add(7, "day");

const DEFAULT_END_DATE = today.format(dateFormat);

export default class App extends Component<Props, State> {
	private carouselTimerId: NodeJS.Timeout | null;
	private refreshDataTimerId: NodeJS.Timeout | null;
	private carouselIntervalStorageKey: string = "setting-carousel-interval";
	private titleStorageKey: string = "setting-leaderboard-title";
	private startDateStorageKey: string = "setting-startdate";
	private endDateStorageKey: string = "setting-enddate";
	private expectationStorageKey: string = "setting-expectation";

	constructor(props: object) {
		super(props);
		this.carouselTimerId = null;
		this.refreshDataTimerId = null;

		const title = localStorage.getItem(this.titleStorageKey) || DEFAULT_TITLE;
		const carouselInterval = localStorage.getItem(this.carouselIntervalStorageKey) || DEFAULT_CAROUSEL_INTERVAL;
		const startDate = localStorage.getItem(this.startDateStorageKey) || DEFAULT_START_DATE;
		const endDate = localStorage.getItem(this.endDateStorageKey) || DEFAULT_END_DATE;
		const expectation = localStorage.getItem(this.expectationStorageKey) || DEFAULT_EXPECTATION;

		this.state = {
			title: title,
			template_name: "",
			template_icon: "",
			teams: [],
			carouselInterval: +carouselInterval,
			refreshInterval: DEFAULT_REFRESH_INTERVAL,
			expectation: +expectation,
			startDate: startDate,
			endDate: endDate
		};
	}

	componentWillMount() {
		this.applyLeaderboardTemplate();
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

	onSettingsUpdate(settings: any) {
		let { carouselInterval, title, startDate, endDate, expectation } = this.state;
		let dateRangeModified = (settings.startDate !== startDate || settings.endDate !== endDate);
		let carouselIntervalModified = settings.interval !== carouselInterval;


		if (settings.title === title
			&& settings.expectation === expectation
			&& !carouselIntervalModified
			&& !dateRangeModified) return;

		this.setState({
			carouselInterval: settings.interval,
			title: settings.title,
			expectation: settings.expectation,
			startDate: settings.startDate,
			endDate: settings.endDate
		});

		localStorage.setItem(this.titleStorageKey, settings.title.toString());
		localStorage.setItem(this.expectationStorageKey, settings.expectation.toString());

		if (carouselIntervalModified) {
			localStorage.setItem(this.carouselIntervalStorageKey, settings.interval.toString());
			this.setTimer();
		}

		if (dateRangeModified) {
			localStorage.setItem(this.startDateStorageKey, settings.startDate.toString());
			localStorage.setItem(this.endDateStorageKey, settings.endDate.toString());

			if (this.refreshDataTimerId !== null) {
				clearTimeout(this.refreshDataTimerId);
				this.startRefreshData(settings.startDate, settings.endDate);
			}
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
		let { title, template_name, template_icon, teams,
			carouselInterval: interval, startDate, endDate, expectation } = this.state;

		return (
			<div className="App">
				<Header title={title}
					interval={interval}
					expectation={expectation}
					startDate={startDate}
					endDate={endDate}
					onSettingsUpdate={(settings: any) => {
						this.onSettingsUpdate(settings);
					}}
				/>
				<div className="main-content">
					<div className="overview-panel">
						<Leaderboard title={template_name}
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