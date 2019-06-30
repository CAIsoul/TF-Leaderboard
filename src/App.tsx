import React, { Component } from 'react';
import { LeaderboardData, Team } from './api/LeaderboardData';
import { fetchData } from './api/FetchData';
import Header from './components/Header';
import Leaderboard from './components/Leaderboard';
import StatCarousel from './components/StatCarousel';
import './styles/App.css';

interface Props {

}

interface State {
  theme_name: string,
  teams: Team[]
}

export default class App extends Component<Props, State> {
  constructor(props: object) {
    super(props);
    this.state = {
      theme_name: "",
      teams: []
    };
  }

  componentWillMount() {
    this.readLeaderboardData();
  }

  readLeaderboardData() {
    fetchData()
      .then((res: LeaderboardData) => {
        this.freshLeaderboard(res);
      });
  }

  freshLeaderboard(data: LeaderboardData) {
    const { theme_name, teams } = data;
        this.setState({
          theme_name: theme_name,
          teams: teams
        });  
  }

  render() {
    let { theme_name, teams } = this.state;

    return (
      <div className="App">
        <Header></Header>
        <div className="Content">
          <div className="OverviewPanel">
            <Leaderboard title={theme_name} teams={teams}></Leaderboard>
          </div>
          <div className="DetailPanel">
            <StatCarousel teams={teams}></StatCarousel>
          </div>
        </div>
      </div>
    );
  }
};

