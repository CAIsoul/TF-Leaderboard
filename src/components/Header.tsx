import React, { PureComponent } from 'react';
import { Modal, Slider, InputNumber, Input, DatePicker } from 'antd';
import moment from 'moment';
import '../styles/Header.scss';


interface Props {
	title: string;
	settingsVisible?: boolean;
	interval: number;
	expectation: number;
	startDate: string;
	endDate: string;
	onSettingsUpdate: Function;
}

interface State {
	title: string;
	expectation: number;
	startDate: string;
	endDate: string;
	interval: number;
	settingsVisible: boolean;
}

const dateFormat = "YYYY-MM-DD";

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
		this.setState({ settingsVisible: true });
	}

	handleOk = () => {
		let { title, interval, startDate, endDate, expectation } = this.state;

		this.setState({ settingsVisible: false });

		this.props.onSettingsUpdate({
			title: title,
			interval: interval,
			startDate: startDate,
			endDate: endDate,
			expectation: expectation
		});
	}

	handleCancel = () => {
		let { title, interval, startDate, endDate, expectation } = this.props;

		this.setState({
			settingsVisible: false,
			title: title,
			interval: interval,
			startDate: startDate,
			endDate: endDate,
			expectation: expectation
		});
	}

	onIntervalChange = (value: any) => {
		this.setState({
			interval: value
		});
	}

	onExpectationChange = (value: any) => {
		this.setState({
			expectation: value
		});
	}

	onTitleChange = (evt: any) => {
		this.setState({
			title: evt.target.value
		});
	}

	onDateRangeChange(dates: any) {
		this.setState({
			startDate: dates[0].format(dateFormat),
			endDate: dates[1].format(dateFormat)
		});
	}

	render() {
		const { title, settingsVisible, interval, expectation, startDate, endDate } = this.state;

		return (
			<div className='app-header'>
				<label>{title}</label>
				{/* <label>{new Date().toLocaleDateString()}</label> */}
				<div className='settings' onClick={this.showModal}></div>
				<Modal
					visible={settingsVisible}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
					title='Setting Refresh Interval'>
					<div className='input-title'>Leaderboard Title</div>
					<div className='title-modal content-wrapper'>
						<div className='input-wrapper'>
							<Input type='primary' value={title} onChange={evt => this.onTitleChange(evt)} />
						</div>
					</div>
					<div className='input-title'>Date Range</div>
					<div className='daterange-modal content-wrapper'>
						<DatePicker.RangePicker
							defaultValue={[moment(startDate, dateFormat), moment(endDate, dateFormat)]}
							format={dateFormat}
							onChange={(dates) => this.onDateRangeChange(dates)} />
					</div>
					<div className='input-title'>Caoursel Interval (second)</div>
					<div className='interval-modal content-wrapper'>
						<div className='slider-wrapper'><Slider min={1} max={30} onChange={(val) => this.onIntervalChange(val)} value={interval} /></div>
						<div className='input-wrapper'><InputNumber min={1} max={30} value={interval} onChange={(val) => this.onIntervalChange(val)} /></div>
					</div>
					<div className='input-title'>Total Point/Case Number Expectation</div>
					<div className='expectation-modal content-wrapper'>
						<div className='slider-wrapper'><Slider min={1} max={2000} onChange={(val) => this.onExpectationChange(val)} value={expectation} /></div>
						<div className='input-wrapper'><InputNumber min={1} max={2000} onChange={(val) => this.onExpectationChange(val)} value={expectation} /></div>
					</div>
				</Modal>
			</div>
		);
	}
};
