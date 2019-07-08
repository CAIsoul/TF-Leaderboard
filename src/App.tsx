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
	template_name: string;
	template_icon: string;
	teams: Team[];
	carouselInterval: number;
	refreshInterval: number;
}

export default class App extends Component<Props, State> {
	timerId: NodeJS.Timeout | null;
	constructor(props: object) {
		super(props);
		this.timerId = null;
		this.state = {
			template_name: "",
			template_icon: "",
			teams: [],
			carouselInterval: 3,
			refreshInterval: 5
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

	onCarouselIntervalChanged = (interval: number) => {
		if (interval === this.state.carouselInterval) return;
		this.setState({ carouselInterval: interval });
		this.setTimer();
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
		let { template_name, template_icon, teams, carouselInterval: interval } = this.state;

		return (
			<div className="App">
				<Header title="TF-Leaderboard" changeCarouselInterval={this.onCarouselIntervalChanged} interval={interval}></Header>
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