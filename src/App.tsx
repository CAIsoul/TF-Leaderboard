import React, { Component } from 'react';
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
}

const DEFAULT_TITLE = "Client Services - Summer: Week One";
const DEFAULT_CAROUSEL_INTERVAL = 15;

export default class App extends Component<Props, State> {
	private timerId: NodeJS.Timeout | null;
	private carouselIntervalStorageKey: string = "setting-carousel-interval";
	private titleStorageKey: string = "setting-leaderboard-title";

	constructor(props: object) {
		super(props);
		this.timerId = null;

		const title = localStorage.getItem(this.titleStorageKey) || DEFAULT_TITLE;
		const carouselInterval = localStorage.getItem(this.carouselIntervalStorageKey) || DEFAULT_CAROUSEL_INTERVAL;

		this.state = {
			title: title,
			template_name: "",
			template_icon: "",
			teams: [],
			carouselInterval: +carouselInterval,
			refreshInterval: 30
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

	readLeaderboardData() {
		fetchCaseData()
			.then((res: any) => {
				let { teams } = this.state;

				teams.forEach(t => {
					t.case_number = 0;
					t.total_point = 0;

					t.members.forEach(m => {
						const stat = res[m.id];

						if (!stat) return;

						const { total_point, case_number } = stat;

						t.case_number += case_number;
						t.total_point += total_point;

						m.case_number = case_number;
						m.total_point = total_point;
					})
				})

				this.setState({ teams: teams });
			});
	}

	startRefreshData() {
		const { refreshInterval } = this.state;
		this.readLeaderboardData();

		setTimeout(() => {

			this.startRefreshData();

		}, refreshInterval * 1000);
	}

	onSettingsUpdate = (settings: any) => {
		let { carouselInterval, title } = this.state;

		if (settings.interval === carouselInterval
			&& settings.title === title) return;

		this.setState({
			carouselInterval: settings.interval,
			title: settings.title
		});

		this.setTimer();

		localStorage.setItem(this.carouselIntervalStorageKey, settings.interval.toString());
		localStorage.setItem(this.titleStorageKey, settings.title.toString());
	}

	clearTimer() {
		if (this.timerId !== null) {
			clearInterval(this.timerId);
		}
	}

	setTimer() {
		this.clearTimer();
	}

	render() {
		let { title, template_name, template_icon, teams, carouselInterval: interval } = this.state;

		return (
			<div className="App">
				<Header title={title}
					onSettingsUpdate={this.onSettingsUpdate}
					interval={interval}
				/>
				<div className="main-content">
					<div className="overview-panel">
						<Leaderboard title={template_name} teams={teams} icon={template_icon}></Leaderboard>
					</div>
					<div className="detail-panel">
						<StatCarousel teams={teams} interval={this.state.carouselInterval}></StatCarousel>
					</div>
				</div>
			</div>
		);
	}
};