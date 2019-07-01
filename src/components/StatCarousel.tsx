import React, { PureComponent } from "react";
import { Carousel } from 'react-bootstrap';
import { Team, Member, Stat } from '../api/LeaderboardData';
import crown from '../images/icons/crown.png';
import './StatCarousel.css';

interface Props {
	teams: Team[]
}

interface State {
	teams: Team[]
}

export default class StatCarousel extends PureComponent<Props, State> {
	constructor(props: any) {
		super(props);

		this.state = {
			teams: props.teams
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

	renderTeamStat(teams: Team[]) {
		teams.map(t => {

		});

		return (
			<div className='StatList Team'>
				{
					teams.map((t, index) => {
						return (
							<div key={index} className='TeamStatItem'>
								<div className='TeamName'>{t.name}</div>
								<div className='TeamStat'>
									<div>Cases: {t.stat.case_number}</div>
									<div>Points: {t.stat.total_score}</div>
									<div>Avg: {this.calculateAvgPoint(t.stat)}</div>
								</div>
								<div className='underline'></div>
								<div className='TeamMembers'>
									{
										this.renderMemberStat(t.members, false)
									}
								</div>
							</div>
						);
					})
				}
			</div>
		);
	}

	renderMemberStat(members: Member[], isMemberRankList: boolean) {
		members.sort((a: Member, b: Member) => {
			return a.stat.total_score > b.stat.total_score ? 1 : -1;
		});

		return (
			<div className='StatList Member'>
				<div className='MemberStatItem'>
					<div className='NameLabel'>Name</div>
					<div>Cases</div>
					<div>Points</div>
					<div>Avg.</div>
				</div>
				{
					members.map((item, index) => {
						const fullName = `${item.first_name} ${item.last_name}`;

						return (
							<div className='MemberStatItem' key={index}>
								<div className='NameLabel'>{fullName}</div>
								<div>{item.stat.case_number}</div>
								<div>{item.stat.total_score}</div>
								<div>{this.calculateAvgPoint(item.stat)}</div>
								{ isMemberRankList && index === 0 ? <img src={crown} className='crown' alt='mvp-crown' /> : null }
							</div>
						);
					})
				}
			</div>
		);
	}

	render() {
		let { teams } = this.state;
		let allMembers: Member[] = [];

		teams.map(t => {
			allMembers.push(...t.members);
		});

		return (
			<Carousel interval={300000}>
				<Carousel.Item>
					<Carousel.Caption>
						<h3>Team Statistic</h3>
					</Carousel.Caption>
					{this.renderTeamStat(teams)}
				</Carousel.Item>
				<Carousel.Item>
					<Carousel.Caption>
						<h3>Member Statistic</h3>
					</Carousel.Caption>
					{this.renderMemberStat(allMembers, true)}
				</Carousel.Item>
			</Carousel>
		);
	}
}