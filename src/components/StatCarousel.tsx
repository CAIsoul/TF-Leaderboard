import React, { PureComponent } from "react";
import { Carousel } from 'react-bootstrap';
import { Team, Member, Stat } from '../api/LeaderboardData';
import crown from '../images/icons/crown.png';
import './StatCarousel.css';

interface Props {
	teams: Team[];
	interval: number;
}

interface State {
	teams: Team[];
	interval: number;
}

export default class StatCarousel extends PureComponent<Props, State> {
	constructor (props: any) {
		super(props);

		this.state = {
			teams: props.teams,
			interval: props.interval
		}
	}

	componentWillReceiveProps(props: any) {
		this.setState({
			teams: props.teams
		});
	}

	calculateAvgPoint(stat: Stat) {
		return (stat.total_score / stat.case_number).toFixed(1);
	}

	getWinningTeamIndex(teams: Team[]) {
		let max = 0, max_index = 0;;
		teams.map((team, index) => {
			if (max < team.stat.total_score) {
				max = team.stat.total_score;
				max_index = index;
			}
		});

		return max_index;
	}

	renderTeamCard(team: Team, isWinningTeam: boolean) {
		return (
			<div className='TeamStatItem'>
				<div className='TeamStat'>
					<div>Cases: {team.stat.case_number }</div>
					<div>Points: { team.stat.total_score }</div>
					<div>Avg: { this.calculateAvgPoint(team.stat) }</div>
				</div>
				<div className='underline'></div>
				<div className='TeamMembers'>
					{
						this.renderMemberStat(team.members, false, isWinningTeam)
					}
				</div>
			</div>
		);
	}

	renderTeamStat(teams: Team[]) {
		return (
			<div className='StatList Team'>
				{
					teams.map((t, index) => {
						return (
							<div key={ index } className='TeamStatItem'>
								<div className='TeamName'>{ t.name }</div>
								<div className='TeamStat'>
									<div>Cases: { t.stat.case_number }</div>
									<div>Points: { t.stat.total_score }</div>
									<div>Avg: { this.calculateAvgPoint(t.stat) }</div>
								</div>
								<div className='underline'></div>
								<div className='TeamMembers'>
									{
										this.renderMemberStat(t.members, false, false)
									}
								</div>
							</div>
						);
					})
				}
			</div>
		);
	}

	renderMemberStat(members: Member[], includeRanking: boolean, isWinningTeam: boolean) {
		members.sort((a: Member, b: Member) => {
			return a.stat.total_score < b.stat.total_score ? 1 : -1;
		});

		return (
			<div className='StatList Member'>
				<div className='MemberStatItem'>
					{ includeRanking ? <div>Rank</div> : null }
					<div className='NameLabel'>Name</div>
					<div>Cases</div>
					<div>Points</div>
					<div>Avg.</div>
				</div>
				{
					members.map((item, index) => {
						const fullName = `${item.first_name} ${item.last_name}`;

						return (
							<div className='MemberStatItem' key={ index }>
								{ includeRanking ? <div>{ index + 1 }</div> : null }
								<div className='NameLabel'>{ fullName }</div>
								<div>{ item.stat.case_number }</div>
								<div>{ item.stat.total_score }</div>
								<div>{ this.calculateAvgPoint(item.stat) }</div>
								{ isWinningTeam && index === 0 ? <img src={ crown } className='crown' alt='mvp-crown' /> : null }
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
			<Carousel interval={interval * 1000}>
				{ 
					teams.map((team, index) => {
						return (
							<Carousel.Item>
								<Carousel.Caption>
									<h3>{team.name}</h3>
								</Carousel.Caption>
									<div className='StatList'>
										{ this.renderTeamCard(team, best_team_index === index) }
									</div>
							</Carousel.Item>
						)
					}) 
				}
			</Carousel>
		);
	}
}