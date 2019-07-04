import React, { PureComponent } from 'react';
import { Modal, Slider, InputNumber } from 'antd';
import '../styles/Header.scss';


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
	constructor(props: any) {
		super(props);

		let { title } = props;

		this.state = {
			title: title,
			settingsVisible: false,
			interval: 30
		};
	}

	componentWillReceiveProps(props: any) {
		this.setState({
			title: props.title
		});
	}

	showModal = () => {
		this.setState({
			settingsVisible: true,
		});
	}

	handleOk = () => {
		this.setState({
			settingsVisible: false,
		});

		this.props.changeCarouselInterval(this.state.interval);
	}

	handleCancel = () => {
		this.setState({
			settingsVisible: false,
		});
	}

	onChange = (value: any) => {
		this.setState({
			interval: value
		});
	}

	render() {
		const { title } = this.state;

		return (
			<div className="app-header">
				<label>{title}</label>
				<label>{new Date().toLocaleDateString()}</label>
				<div className="settings" onClick={this.showModal}></div>
				<Modal
					visible={this.state.settingsVisible}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
					title="Setting Refresh Interval">
					<div className="interval-modal-content-wrapper">
						<div className="slider-wrapper"><Slider min={1} max={100} onChange={this.onChange} value={this.state.interval} /></div>
						<div className="input-wrapper"><InputNumber min={1} max={100} value={this.state.interval} onChange={this.onChange} /></div>
					</div>

				</Modal>
			</div>
		);
	}
};
