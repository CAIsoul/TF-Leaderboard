import React, { Component } from "react";
import { Carousel } from 'antd';
import { Team, Member } from '../api/LeaderboardData';
import { calculateAvgPoint, sortListRank, getMvpOwnerIds } from '../utils/rule';
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
	private mvpOwnerIds: string[] = [];

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

	renderTeamCard(team: Team) {
		return (
			<React.Fragment>
				<div className='team-summary'>
					<div>Cases: {team.case_number}</div>
					<div>Points: {team.total_point}</div>
					<div>Avg: {calculateAvgPoint(team)}</div>
				</div>
				<div>
					{
						this.renderMemberStat(team.members, false)
					}
				</div>
			</React.Fragment>
		);
	}

	renderMemberStat(members: Member[], includeRanking: boolean) {
		sortListRank(members);

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
								<div>{calculateAvgPoint(item)}</div>
								{this.mvpOwnerIds.indexOf(item.id) > -1 ? <img src={crown} className='crown' alt='mvp-crown' /> : null}
							</div>
						);
					})
				}
			</div>
		);
	}


	render() {
		let { teams, interval } = this.state;

		this.mvpOwnerIds = getMvpOwnerIds(teams);

		return (
			<Carousel className="carousel" autoplay autoplaySpeed={interval * 1000} dotPosition="top">
				{
					teams.map((team) =>
						<div className="team" key={team.name}>
							<h3>{team.name}</h3>
							{this.renderTeamCard(team)}
						</div>
					)
				}
			</Carousel>);
	}
}