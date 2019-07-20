export interface Member {
	name: string;
	picutre: string;
	total_point: number;
	case_number: number;
	id: string;
}

export interface Team {
	name: string;
	logo: string;
	color: string;
	total_point: number;
	case_number: number;
	members: Member[];
}

export interface LeaderboardData {
	name: string;
	icon: string;
	teams: Team[];
}

export interface Configuration {
	boardTitle: string;
	carouselInterval: number;
	startDate: string;
	endDate: string;
	scoreExpectation: number;
	winningCondition: string;
}