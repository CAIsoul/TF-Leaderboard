import React, { PureComponent } from 'react';
import './Header.css';
import { Modal, Slider, InputNumber, Row, Col } from 'antd';

interface Props {
  title: string;
  settingsVisible?: boolean;
  interval?: number;
  changeCarouselInterval: Function;
}

interface State {
  title: string;
  settingsVisible: boolean;
  interval: number;
}

export default class Header extends PureComponent<Props, State> {
  constructor (props: any) {
    super(props);

    let { title } = props;

    this.state = {
      title: title,
      settingsVisible: false,
      interval: 30
    };

    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps(props: any) {
    this.setState({
      title: props.title
    });
  }

  showModal() {
    this.setState({
      settingsVisible: true,
    });
  }

  handleOk() {
    this.setState({
      settingsVisible: false,
    });

    this.props.changeCarouselInterval(this.state.interval);
  }

  handleCancel() {
    this.setState({
      settingsVisible: false,
    });
  }

  onChange(value: any) {
    this.setState({
      interval: value
    });
  }

  render() {
    const currentDate = new Date();
    const { title } = this.state;

    return (
      <div className="App-header">
        <label>{ title }</label>
        <label>{ currentDate.toLocaleDateString() }</label>
        <div className="settings" onClick={ this.showModal }></div>
        <Modal
          visible={ this.state.settingsVisible }
          onOk={ this.handleOk }
          onCancel={ this.handleCancel }>
          <Row>
            <Col span={ 12 }>
              <Slider min={ 1 } max={ 100 } onChange={ this.onChange } value={ this.state.interval } />
            </Col>
            <Col span={ 4 }>
              <InputNumber min={ 1 } max={ 100 } style={ { marginLeft: '16px' } }
                value={ this.state.interval } onChange={ this.onChange }
              />
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
};
