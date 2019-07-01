import React, { PureComponent } from 'react';
import './Header.css';

interface Props {
  title: string;
}

interface State {
  title: string;
}

export default class Header extends PureComponent<Props, State> {
  constructor(props: any) {
    super(props)

    let { title } = props;

    this.state = {
      title: title
    }
  }
  componentWillReceiveProps(props: any) {
    this.setState({ 
      title: props.title
    });
  }
 
  render() {
    const currentDate = new Date();
    const { title } = this.state;

    return (
      <div className="App-header">
        <label>{title}</label>
        <label>{currentDate.toLocaleDateString()}</label>
      </div>
    );
  }
};
