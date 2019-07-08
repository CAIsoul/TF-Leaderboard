import React, { PureComponent } from 'react';
import { Modal, Slider, InputNumber, Input } from 'antd';
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

		this.state = Object.assign({}, props, { settingsVisible: false });
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

	onIntervalChange = (value: any) => {
		this.setState({
			interval: value
		});
	}

	onTitleChange = (value: any) => {
		this.setState({
			title: value
		});
	}

	render() {
		const { title, settingsVisible, interval } = this.state;

		return (
			<div className="app-header">
				<label>{title}</label>
				{/* <label>{new Date().toLocaleDateString()}</label> */}
				<div className="settings" onClick={this.showModal}></div>
				<Modal
					visible={settingsVisible}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
					title="Setting Refresh Interval">
					<div>Board Title</div>
					<div className="interval-modal-content-wrapper">
						<div className="input-wrapper">
							<Input value={title} />
						</div>
					</div>
					<div>Caoursel Interval (second)</div>
					<div className="interval-modal-content-wrapper">
						<div className="slider-wrapper"><Slider min={1} max={30} onChange={this.onIntervalChange} value={interval} /></div>
						<div className="input-wrapper"><InputNumber min={1} max={30} value={interval} onChange={this.onIntervalChange} /></div>
					</div>
				</Modal>
			</div>
		);
	}
};
