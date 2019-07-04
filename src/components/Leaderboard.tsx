import React, { PureComponent } from 'react';
import { Team } from '../api/LeaderboardData';
import trophy from '../images/icons/trophy.png';
import '../styles/Leaderboard.scss';

interface Props {
	title: string;
	teams: Team[];
	icon: string;
}

interface State {
	title: string;
	teams: Team[];
	icon: string;
}

export default class Leaderboard extends PureComponent<Props, State> {
	constructor(props: any) {
		super(props);

		this.state = { ...props };
	}

	componentWillReceiveProps(props: any) {

		this.setState({ ...props });
	}

	renderLeaderboard(teams: Team[]) {
		const maxScore = Math.max(...teams.map(o => o.stat.total_score));

		return (
			<div className='content'>
				{
					teams.map((item, index) => {
						const score = item.stat.total_score;

						return (
							<div className='team' key={index}>
								<div className='rank'>{index + 1}.</div>
								<img className='logo' src={item.logo} alt='team logo' />
								<div className='name'>{item.name}</div>
								<div className="bar-container">
									<div className='bar' style={{ width: `${100 * item.stat.total_score / maxScore}%` }}></div>
								</div>
								<div className='score'>{score}</div>
								{index === 0 ? <img src={trophy} className='trophy' alt='winner trophy' /> : <div></div>}
							</div>
						);
					})
				}
			</div>
		);
	}

	render() {
		const { title, teams, icon } = this.state;

		return (
			<div className='leader-board'>
				<div className='title'>
					<img src={icon} className="theme-logo" alt="theme icon" />
					<span className='game-title'>{title}</span>
					<span className='game-hint'>Most Total Points Wins!</span>
				</div>
				<div className='underline'></div>
				{this.renderLeaderboard(teams)}
			</div>
		);
	}
}