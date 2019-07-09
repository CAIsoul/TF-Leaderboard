import React, { Component } from 'react';
import { Team } from '../api/LeaderboardData';
import { getValueOnFactor, sortListRank } from '../utils/rule';
import trophy from '../images/icons/trophy.png';
import '../styles/Leaderboard.scss';

interface Props {
	title: string;
	teams: Team[];
	icon: string;
	expectation: number;
}

interface State {
	title: string;
	teams: Team[];
	icon: string;
	expectation: number;
}

export default class Leaderboard extends Component<Props, State> {
	constructor(props: any) {
		super(props);

		this.state = { ...props };
	}

	componentWillReceiveProps(props: any) {
		this.setState({ ...props });
	}

	renderLeaderboard(teams: Team[], expectation: number) {
		sortListRank(teams);

		const maxValue = Math.max(...teams.map(o => getValueOnFactor(o)));
		const winnerCount = teams.filter(o => getValueOnFactor(o) >= maxValue).length;

		return (
			<div className='content'>
				{
					teams.map((item, index) => {
						const factorValue = getValueOnFactor(item);
						const { name, logo } = item;
						const barWidth = factorValue === 0 ? 0 : `${100 * factorValue / Math.max(expectation, maxValue)}%`;

						return (
							<div className='team' key={index}>
								{/* <div className='rank'>{index + 1}.</div> */}
								{
									!logo ? null : <img className='logo' src={`data:image/png;base64,${logo}`} alt='team logo' />
								}
								<div className='name'>{name}</div>
								<div className="bar-container">
									<div className='bar' style={{ width: barWidth }}></div>
								</div>
								<div className='score'>{factorValue}</div>
								{(winnerCount === 1 && index === 0) ? <img src={trophy} className='trophy' alt='winner trophy' /> : <div></div>}
							</div>
						);
					})
				}
			</div>
		);
	}

	render() {
		const { title, teams, icon, expectation } = this.state;

		return (
			<div className='leader-board'>
				<div className='title'>
					{
						!icon ? null : <img src={`data:image/png;base64,${icon}`} className="theme-logo" alt="theme icon" />
					}
					<span className='game-title'>{title}</span>
					<span className='game-hint'>Most Total Points Wins!</span>
				</div>
				<div className='underline'></div>
				{this.renderLeaderboard(teams, expectation)}
			</div>
		);
	}
}