import moment from 'moment';
import { Configuration } from '../api/LeaderboardData';
import { fetchConfiguration } from '../api/FetchData';

const dateFormat = "YYYY-MM-DD";
let today = moment();

let configuration: any = {};

export function refresh() {
	return fetchConfiguration()
		.then((res: Configuration) => {
			configuration = res;
		});
}

export function update(config: Configuration) {

}

export function get(key: string) {
	switch (key) {
		case 'leaderboard-title':
			return configuration.boardTitle;
		case 'carousel-interval':
			return configuration.carouselInterval;
		case 'start-date':
			return configuration.startDate || today.format(dateFormat);
		case 'end-date':
			return configuration.endDate || today.add(7, "day").format(dateFormat);
		case 'score-expectation':
			return configuration.scoreExpectation;
		case 'winning-condition':
			return configuration.winningCondition;
	}

	return null;
}
