import React, { Component } from "react";
import { Carousel } from 'antd';
import { Team, Member } from '../api/LeaderboardData';
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

export default class StatCarousel extends Component<Props, State> {
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

	calculateAvgPoint(item: any) {
		let value = (item.case_number === 0) ? 0 : (item.total_point / item.case_number);

		return value.toFixed(1);
	}

	getWinningTeamIndex(teams: Team[]) {
		let max = 0, max_index = 0;;
		teams.forEach((team, index) => {
			if (max < team.total_point) {
				max = team.total_point;
				max_index = index;
			}
		});

		return max_index;
	}

	renderTeamCard(team: Team, isWinningTeam: boolean) {
		return (
			<React.Fragment>
				<div className='team-summary'>
					<div>Cases: {team.case_number}</div>
					<div>Points: {team.total_point}</div>
					<div>Avg: {this.calculateAvgPoint(team)}</div>
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
			if (a.total_point === b.total_point) {
				if (a.case_number === b.case_number) {
					return a.name < b.name ? 1 : -1;
				}

				return a.case_number < b.case_number ? 1 : -1;
			}

			return a.total_point < b.total_point ? 1 : -1;
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
						const fullName = `${item.name}`;

						return (
							<div className='member' key={index}>
								{includeRanking ? <div>{index + 1}</div> : null}
								<div className='name'>{fullName}</div>
								<div>{item.case_number}</div>
								<div>{item.total_point}</div>
								<div>{this.calculateAvgPoint(item)}</div>
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