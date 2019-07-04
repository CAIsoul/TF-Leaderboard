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
	private containerWidth = 0;

	constructor(props: any) {
		super(props)

		const { title, teams, icon } = props;

		this.state = {
			title: title,
			teams: teams,
			icon: icon
		};
	}

	componentWillReceiveProps(props: any) {
		const { title, teams, icon } = props;

		this.setState({
			title: title,
			teams: teams,
			icon: icon
		});
	}

	renderLeaderboard(teams: Team[]) {
		const rankWidth = 30;
		const imgWidth = 100;
		const nameWidth = 150;
		const scoreWidth = 100;
		const barPadding = 10;
		const totalBarWidth = this.containerWidth - rankWidth - imgWidth - nameWidth - scoreWidth - barPadding * 2;

		console.log(`total bar width is ${totalBarWidth}`);

		let scroeList = teams.map(o => o.stat.total_score);
		const maxScore = Math.max(...scroeList);

		return (
			<div className='content'>
				{teams.map((item, index) => {
					const score = item.stat.total_score;

					return (
						<div className='team' key={index}>
							<div className='rank'>{index + 1}.</div>
							<img className='logo' src={item.logo} alt='team logo' />
							<div className='name'>{item.name}</div>
							<div className='bar' style={{ width: (item.stat.total_score / maxScore) * totalBarWidth }}></div>
							<div className='score'>{score}</div>
							{index === 0 ? <img src={trophy} className='trophy' alt='winner trophy' /> : <div></div>}
						</div>
					);
				})}
			</div>
		);
	}

	render() {
		const { title, teams, icon } = this.state;

		return (
			<div className='Leaderboard' ref={node => { if (node) this.containerWidth = node.offsetWidth }}>
				<div className='title'>
					<img src={icon} className="App-logo" alt="theme icon" />
					<span className='GameTitle'>{title}</span>
					<span className='GameHint'>Most Total Points Wins!</span>
				</div>
				<div className='underline'></div>
				<div className='content'>
					{this.renderLeaderboard(teams)}
				</div>
			</div>
		);
	}
}