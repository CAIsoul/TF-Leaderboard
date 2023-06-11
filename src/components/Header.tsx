import React, { PureComponent } from 'react';
import { Modal, Slider, InputNumber, Input, DatePicker, Select, Menu } from 'antd';
import moment from 'moment';
import '../styles/Header.scss';
import dayjs from 'dayjs';


interface Props {
	boardTitle: string;
	winningCondition: string;
	settingsVisible?: boolean;
	carouselInterval: number;
	scoreExpectation: number;
	startDate: string;
	endDate: string;
	onSettingsUpdate: Function;
}

interface State {
	boardTitle: string;
	winningCondition: string;
	scoreExpectation: number;
	startDate: string;
	endDate: string;
	carouselInterval: number;
	settingsVisible: boolean;
}

const { Option } = Select;
const dateFormat = "YYYY-MM-DD";

export default class Header extends PureComponent<Props, State> {
	constructor(props: any) {
		super(props);

		this.state = Object.assign({}, props, { settingsVisible: false });
	}

	componentWillReceiveProps(props: any) {
		this.setState(Object.assign({}, props));
	}

	showModal = () => {
		this.setState({ settingsVisible: true });
	}

	handleOk = () => {
		let { boardTitle, winningCondition, carouselInterval, startDate, endDate, scoreExpectation } = this.state;

		this.setState({ settingsVisible: false });

		this.props.onSettingsUpdate({
			boardTitle: boardTitle,
			winningCondition: winningCondition,
			carouselInterval: carouselInterval,
			startDate: startDate,
			endDate: endDate,
			scoreExpectation: scoreExpectation
		});
	}

	handleCancel = () => {
		let { boardTitle, winningCondition, carouselInterval, startDate, endDate, scoreExpectation } = this.props;

		this.setState({
			settingsVisible: false,
			boardTitle: boardTitle,
			winningCondition: winningCondition,
			carouselInterval: carouselInterval,
			startDate: startDate,
			endDate: endDate,
			scoreExpectation: scoreExpectation
		});
	}

	onIntervalChange(value: any) {
		this.setState({
			carouselInterval: value
		});
	}

	onExpectationChange(value: any) {
		this.setState({
			scoreExpectation: value
		});
	}

	onTitleChange(evt: any) {
		this.setState({
			boardTitle: evt.target.value
		});
	}

	onDateRangeChange(dates: any) {
		if (dates.length < 2) return;

		this.setState({
			startDate: dates[0].format(dateFormat),
			endDate: dates[1].format(dateFormat)
		});
	}

	onWinningConditionChange(value: string) {
		this.setState({ winningCondition: value });
	}

	renderSettingModal() {
		let { boardTitle, winningCondition, settingsVisible, carouselInterval, scoreExpectation, startDate, endDate } = this.state;

		return (
			<Modal
				visible={settingsVisible}
				onOk={this.handleOk}
				onCancel={this.handleCancel}
				title='Setting Refresh Interval'>
				<div className='input-group'>
					<div className='input-title'>Leaderboard Title</div>
					<div className='title-modal content-wrapper'>
						<div className='input-wrapper'>
							<Input type='primary' value={boardTitle} onChange={evt => this.onTitleChange(evt)} />
						</div>
					</div>
				</div>
				<div className='input-group'>
					<div className='input-title'>Date Range</div>
					<div className='daterange-modal content-wrapper'>
						<DatePicker.RangePicker
							defaultValue={[dayjs(startDate, dateFormat), dayjs(endDate, dateFormat)]}
							format={dateFormat}
							onChange={(dates) => this.onDateRangeChange(dates)} />
					</div>
				</div>
				<div className='input-group'>
					<div className='input-title'>Winning Condition</div>
					<div className='dropdown-modal content-wrapper'>
						<Select value={winningCondition}
							defaultValue={winningCondition}
							style={{ width: 200 }}
							onChange={(val: string) => this.onWinningConditionChange(val)}>
							<Option value="total_point">Total Point</Option>
							<Option value="case_number">Case Number</Option>
							<Option value="average">Average Point</Option>
						</Select>
					</div>
				</div>
				<div className='input-group'>
					<div className='input-title'>Caoursel Interval (second)</div>
					<div className='interval-modal content-wrapper'>
						<div className='slider-wrapper'><Slider min={1} max={30} onChange={(val) => this.onIntervalChange(val)} value={carouselInterval} /></div>
						<div className='input-wrapper'><InputNumber min={1} max={30} value={carouselInterval} onChange={(val) => this.onIntervalChange(val)} /></div>
					</div>
				</div>
				<div className='input-group'>
					<div className='input-title'>Score Expectation</div>
					<div className='expectation-modal content-wrapper'>
						<div className='slider-wrapper'><Slider min={1} max={2000} onChange={(val) => this.onExpectationChange(val)} value={scoreExpectation} /></div>
						<div className='input-wrapper'><InputNumber min={1} max={2000} onChange={(val) => this.onExpectationChange(val)} value={scoreExpectation} /></div>
					</div>
				</div>
			</Modal>
		);
	}

	render() {
		const { boardTitle } = this.state;
		return (
			<div className='app-header'>
				<label>{boardTitle}</label>
				<div className='settings' onClick={this.showModal}></div>
				{this.renderSettingModal()}
			</div>
		);
	}
};
