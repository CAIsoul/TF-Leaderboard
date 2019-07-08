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
	private mvp_owner_ids: string[] = [];

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

	renderTeamCard(team: Team) {
		return (
			<React.Fragment>
				<div className='team-summary'>
					<div>Cases: {team.case_number}</div>
					<div>Points: {team.total_point}</div>
					<div>Avg: {this.calculateAvgPoint(team)}</div>
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
		members.sort((a: Member, b: Member) => {
			if (a.total_point === b.total_point) {
				if (a.case_number === b.case_number) {
					return a.name > b.name ? 1 : -1;
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
								{this.mvp_owner_ids.indexOf(item.id) > -1 ? <img src={crown} className='crown' alt='mvp-crown' /> : null}
							</div>
						);
					})
				}
			</div>
		);
	}

	getMvpOwnerIds(teams: Team[]) {
		let best_team_indices: number[] = [];
		let max_point: number = 0;
		let member_count = 0;

		teams.forEach((o, i) => {
			if (o.total_point > max_point) {
				best_team_indices = [i];
				max_point = o.total_point;
			}
			else if (o.total_point === max_point) {
				best_team_indices.push(i);
			}
		});

		max_point = 0;
		teams.forEach((t, i) => {
			if (best_team_indices.indexOf(i) === -1) return;

			t.members.forEach(m => {
				if (max_point < m.total_point) {
					max_point = m.total_point;
					this.mvp_owner_ids = [m.id];
				}
				else if (max_point === m.total_point) {
					this.mvp_owner_ids.push(m.id);
				}

				member_count++;
			});
		});

		if (this.mvp_owner_ids.length > member_count / 10) {
			this.mvp_owner_ids = [];
		}
	}

	render() {
		let { teams, interval } = this.state;

		this.getMvpOwnerIds(teams);

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