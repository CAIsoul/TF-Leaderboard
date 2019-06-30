import React, { Component } from 'react';
import logo from '../images/logo.svg';
import './Header.css';

export default class Header extends Component {
  render() {
    const currentDate = new Date();

    return (
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <label>TF-Leaderboard</label>
        <label>{currentDate.toLocaleDateString()}</label>
      </div>
    );
  }
};
