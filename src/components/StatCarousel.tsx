import React, { PureComponent } from "react";
import { Carousel } from 'antd';
import { Team, Member, Stat } from '../api/LeaderboardData';
import crown from '../images/icons/crown.png';
import '../styles/StatCarousel.scss';

interface Props {
	teams: Team[];
	interval: number;
}

interface State {
	teams: Team[];
	interval: number;
}

export default class StatCarousel extends PureComponent<Props, State> {
	constructor(props: any) {
		super(props);

		this.state = { ...props };
	}

	componentWillReceiveProps(props: any) {
		this.setState({
			teams: props.teams,
			interval: props.interval
		});
	}

	calculateAvgPoint(stat: Stat) {
		return (stat.total_score / stat.case_number).toFixed(1);
	}

	getWinningTeamIndex(teams: Team[]) {
		let max = Math.max(...teams.map(t => t.stat.total_score || 0));
		return teams.findIndex(t => t.stat.total_score === max);
	}

	renderTeamCard(team: Team, isWinningTeam: boolean) {
		return (
			<React.Fragment>
				<div className='team-summary'>
					<div>Cases: {team.stat.case_number}</div>
					<div>Points: {team.stat.total_score}</div>
					<div>Avg: {this.calculateAvgPoint(team.stat)}</div>
				</div>
				<div>
					{
						this.renderMemberStat(team.members, false, isWinningTeam)
					}
				</div>
			</React.Fragment>
		);
	}

	renderMemberStat(members: Member[], includeRanking: boolean, isWinningTeam: boolean) {
		members.sort((a: Member, b: Member) => {
			return a.stat.total_score < b.stat.total_score ? 1 : -1;
		});

		return (
			<div className='member-list'>
				<div className='member list-header'>
					{includeRanking ? <div>Rank</div> : null}
					<div className='name'>Name</div>
					<div>Cases</div>
					<div>Points</div>
					<div>Avg.</div>
				</div>
				{
					members.map((item, index) => {
						const fullName = `${item.first_name} ${item.last_name}`;

						return (
							<div className='member' key={index}>
								{includeRanking ? <div>{index + 1}</div> : null}
								<div className='name'>{fullName}</div>
								<div>{item.stat.case_number}</div>
								<div>{item.stat.total_score}</div>
								<div>{this.calculateAvgPoint(item.stat)}</div>
								{isWinningTeam && index === 0 ? <img src={crown} className='crown' alt='mvp-crown' /> : null}
							</div>
						);
					})
				}
			</div>
		);
	}

	render() {
		let { teams, interval } = this.state;
		const best_team_index = this.getWinningTeamIndex(teams);

		return (
			<Carousel className="carousel" autoplay autoplaySpeed={interval * 1000} dotPosition="top">
				{
					teams.map((team, index) =>
						<div className="team" key={team.name}>
							<h3>{team.name}</h3>
							{this.renderTeamCard(team, best_team_index === index)}
						</div>
					)
				}
			</Carousel>);
	}
}