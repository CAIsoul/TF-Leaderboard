import moment from 'moment';

const dateFormat = "YYYY-MM-DD";
let today = moment();

const mapping: any = {
	'carousel-interval': {
		'defaultValue': 15,
		'storageKey': "setting-carousel-interval"
	},
	'leaderboard-title': {
		'defaultValue': "Client Services - Summer: Week One",
		'storageKey': '"setting-leaderboard-title"'
	},
	'start-date': {
		'defaultValue': today.format(dateFormat),
		'storageKey': "setting-startdate"
	},
	'end-date': {
		'defaultValue': today.add(7, "day").format(dateFormat),
		'storageKey': "setting-enddate"
	},
	'score-expectation': {
		'defaultValue': 1000,
		'storageKey': "setting-expectation"
	}
};

export function save(key: string, val: any) {
	localStorage.setItem(mapping[key].storageKey, val);
}

export function get(key: string) {
	return localStorage.getItem(mapping[key].storageKey) || mapping[key].defaultValue;
}