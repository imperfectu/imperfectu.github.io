/** Core media & transmedia type definitions for Imperfectu */

export type MaturityRating = 'G' | 'PG' | 'PG-13' | 'R' | 'TV-MA' | 'NR';

export type TransmediaKind =
	| 'audio'
	| 'interactive'
	| 'document'
	| 'bts'
	| 'spatial'
	| 'download';

export type MediaGenre =
	| 'Drama'
	| 'Sci-Fi'
	| 'Thriller'
	| 'Documentary'
	| 'Experimental'
	| 'Horror'
	| 'Romance'
	| 'Fantasy'
	| 'Animation';

export interface MediaItem {
	id: string;
	title: string;
	description: string;
	thumbnail_url: string;
	trailer_url: string;
	main_video_url: string;
	backdrop_url?: string;
	release_year: number;
	maturity_rating: MaturityRating;
	duration_minutes?: number;
	tags: string[];
	genres: MediaGenre[];
	cast?: string[];
	creators?: string[];
	featured?: boolean;
	has_transmedia?: boolean;
}

export interface TransmediaItem {
	id: string;
	media_id: string;
	kind: TransmediaKind;
	title: string;
	description?: string;
	/** Audio / secondary video / spatial asset URL */
	asset_url?: string;
	/** PDF / downloadable lore file */
	file_url?: string;
	/** Interactive story payload or choice tree reference */
	interactive_payload?: InteractiveChoice[];
	sort_order?: number;
}

export interface InteractiveChoice {
	id: string;
	prompt: string;
	options: {
		id: string;
		label: string;
		/** Optional next node or media cue */
		outcome?: string;
	}[];
}

export interface User {
	id: string;
	email: string;
	display_name: string;
	avatar_url?: string;
	created_at: string;
}

export interface WatchHistory {
	id: string;
	user_id: string;
	media_id: string;
	progress_seconds: number;
	duration_seconds: number;
	completed: boolean;
	last_watched_at: string;
}

export interface ContentRowData {
	id: string;
	title: string;
	items: MediaItem[];
}

export type HubTab = 'narrative' | 'audio' | 'lore' | 'interactive';
