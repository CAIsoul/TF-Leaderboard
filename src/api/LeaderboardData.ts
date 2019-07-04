export interface Stat {
	case_number: number;
	total_score: number;
}

export interface Member {
	first_name: string;
	last_name: string;
	picutre: string;
	stat: Stat;
}

export interface Team {
	name: string;
	stat: Stat;
	logo: string;
	color: string;
	members: Member[];
}

export interface LeaderboardData {
	theme_name: string;
	theme_icon: string;
	teams: Team[];
}