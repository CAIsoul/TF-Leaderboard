import React, { PureComponent } from 'react';
import { Team } from '../api/LeaderboardData';
import './Leaderboard.css';

interface Props {
    title: string,
    teams: Team[]
}

interface State {
    title: string,
    teams: Team[]
}

export default class Leaderboard extends PureComponent<Props, State> {
    private containerWidth = 0;

    constructor(props: any) {
        super(props)

        const { title, teams } = props;

        this.state = {
            title: title,
            teams: teams
        };
    }

    componentWillReceiveProps(props: any) {
        const { title, teams } = props;

        this.setState({
            title: title,
            teams: teams
        });
    }

    renderLeaderboard(teams: Team[]) {
        const imgWidth = 100;
        const nameWidth = 150;
        const scoreWidth = 100;
        const barPadding = 10;
        const totalBarWidth = this.containerWidth - imgWidth - nameWidth - scoreWidth - barPadding * 2;

        console.log(`total bar width is ${totalBarWidth}`);

        let scroeList = teams.map(o => o.stat.total_score); 
        const maxScore = Math.max(...scroeList);

        return (
            <div className='content'>
                { teams.map((item, index) => {
                    const score = item.stat.total_score;

                    return (
                        <div className='team' key={index}>
                            <img className='logo' src={item.logo}/>
                            <div className='name'>{item.name}</div>
                            <div className='bar' style={{ width: (item.stat.total_score / maxScore) * totalBarWidth }}></div>
                            <div className='score'>{score}</div>
                        </div>
                    );
                }) }                
            </div>
        );
    }

    render() {
        const { title, teams } = this.state;

        return (
            <div className='Leaderboard'  ref={ node => { if (node) this.containerWidth = node.offsetWidth } }>
                <div className='title'>
                    <label>{title}</label>
                </div>
                <div className='underline'></div>
                <div className='content'>
                    { this.renderLeaderboard(teams) }
                </div>
            </div>
        );
    }
}