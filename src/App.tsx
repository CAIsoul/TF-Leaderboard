import React, { Component } from 'react';
import { LeaderboardData, Team } from './api/LeaderboardData';
import { fetchData } from './api/FetchData';
import Header from './components/Header';
import Leaderboard from './components/Leaderboard';
import StatCarousel from './components/StatCarousel';
import './styles/App.scss';

interface Props {

}

interface State {
	theme_name: string;
	theme_icon: string;
	teams: Team[];
	carouselInterval: number;
}

export default class App extends Component<Props, State> {
	timerId: NodeJS.Timeout | null;
	constructor(props: object) {
		super(props);
		this.timerId = null;
		this.state = {
			theme_name: "",
			theme_icon: "",
			teams: [],
			carouselInterval: 3
		};
	}

	componentWillMount() {
		const { carouselInterval: interval } = this.state;
		this.readLeaderboardData().then(() => {
			this.setTimer(interval);
		});
	}

	componentWillUnmount() {
		this.clearTimer();
	}

	readLeaderboardData() {
		return fetchData().then((res: LeaderboardData) => {
			this.freshLeaderboard(res);
		});
	}

	freshLeaderboard(data: LeaderboardData) {
		this.setState({ ...data });
	}

	onCarouselIntervalChanged = (interval: number) => {
		if (interval === this.state.carouselInterval) return;
		this.setState({ carouselInterval: interval });
		this.setTimer(interval);
	}

	clearTimer() {
		if (this.timerId !== null) {
			clearInterval(this.timerId);
		}
	}

	setTimer(interval: number) {
		this.clearTimer();
		this.timerId = setInterval(this.readLeaderboardData.bind(this), interval * 1000);
	}

	render() {
		let { theme_name, theme_icon, teams, carouselInterval: interval } = this.state;

		return (
			<div className="App">
				<Header title="TF-Leaderboard" changeCarouselInterval={this.onCarouselIntervalChanged} interval={interval}></Header>
				<div className="main-content">
					<div className="overview-panel">
						<Leaderboard title={theme_name} teams={teams} icon={theme_icon}></Leaderboard>
					</div>
					<div className="detail-panel">
						<StatCarousel teams={teams} interval={this.state.carouselInterval}></StatCarousel>
					</div>
				</div>
			</div>
		);
	}
};