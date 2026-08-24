import type { ContentRowData, MediaItem, TransmediaItem } from '$lib/types';

/** Placeholder imagery — swap for Supabase/CDN assets later */
const img = (seed: string, w = 1280, h = 720) =>
	`https://picsum.photos/seed/${seed}/${w}/${h}`;

export const mockMedia: MediaItem[] = [
	{
		id: 'echoes-of-glass',
		title: 'Echoes of Glass',
		description:
			'A fractured documentary that unfolds across film, companion audio diaries, and an interactive archive of lost letters.',
		thumbnail_url: img('echoes-glass', 640, 360),
		backdrop_url: img('echoes-glass-bg', 1920, 1080),
		trailer_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
		main_video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
		release_year: 2025,
		maturity_rating: 'TV-MA',
		duration_minutes: 48,
		tags: ['Transmedia', 'Archive', 'Memory'],
		genres: ['Documentary', 'Experimental'],
		cast: ['Mira Chen', 'Jonah Vale'],
		creators: ['Imperfectu Collective'],
		featured: true,
		has_transmedia: true
	},
	{
		id: 'night-circuit',
		title: 'Night Circuit',
		description:
			'Neon-soaked thriller where the soundtrack is a second narrative — listen while you watch, or follow the audio branch alone.',
		thumbnail_url: img('night-circuit', 640, 360),
		backdrop_url: img('night-circuit-bg', 1920, 1080),
		trailer_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
		main_video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
		release_year: 2024,
		maturity_rating: 'R',
		duration_minutes: 92,
		tags: ['Audio Lore', 'Noir'],
		genres: ['Thriller', 'Sci-Fi'],
		creators: ['A. Reyes'],
		has_transmedia: true
	},
	{
		id: 'salt-and-signal',
		title: 'Salt & Signal',
		description:
			'Coastal myth meets radio drama. Branching choices decide which coastal town survives the storm.',
		thumbnail_url: img('salt-signal', 640, 360),
		trailer_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
		main_video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
		release_year: 2023,
		maturity_rating: 'PG-13',
		duration_minutes: 64,
		tags: ['Interactive', 'Myth'],
		genres: ['Fantasy', 'Drama'],
		has_transmedia: true
	},
	{
		id: 'static-garden',
		title: 'Static Garden',
		description: 'An experimental short where downloadable field recordings reshape the edit.',
		thumbnail_url: img('static-garden', 640, 360),
		trailer_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
		main_video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
		release_year: 2026,
		maturity_rating: 'NR',
		duration_minutes: 22,
		tags: ['Spatial', 'Sound'],
		genres: ['Experimental', 'Animation'],
		has_transmedia: true
	},
	{
		id: 'redline-ritual',
		title: 'Redline Ritual',
		description: 'Horror anthology with PDF grimoires and behind-the-scenes ritual tapes.',
		thumbnail_url: img('redline-ritual', 640, 360),
		trailer_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
		main_video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
		release_year: 2024,
		maturity_rating: 'TV-MA',
		duration_minutes: 55,
		tags: ['Lore', 'Horror'],
		genres: ['Horror', 'Thriller'],
		has_transmedia: true
	},
	{
		id: 'orbit-letters',
		title: 'Orbit Letters',
		description: 'Epistolary sci-fi romance told through film and downloadable correspondence packs.',
		thumbnail_url: img('orbit-letters', 640, 360),
		trailer_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
		main_video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
		release_year: 2025,
		maturity_rating: 'PG-13',
		duration_minutes: 78,
		tags: ['Romance', 'Epistolary'],
		genres: ['Romance', 'Sci-Fi'],
		has_transmedia: false
	},
	{
		id: 'warehouse-forty',
		title: 'Warehouse Forty',
		description: 'Industrial documentary with annotated blueprints and crew commentary tracks.',
		thumbnail_url: img('warehouse-40', 640, 360),
		trailer_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
		main_video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
		release_year: 2022,
		maturity_rating: 'PG',
		duration_minutes: 41,
		tags: ['Archive'],
		genres: ['Documentary'],
		has_transmedia: true
	},
	{
		id: 'veil-protocol',
		title: 'Veil Protocol',
		description: 'Speculative thriller with an interactive evidence board.',
		thumbnail_url: img('veil-protocol', 640, 360),
		trailer_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
		main_video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
		release_year: 2026,
		maturity_rating: 'R',
		duration_minutes: 110,
		tags: ['Interactive', 'Conspiracy'],
		genres: ['Thriller', 'Sci-Fi'],
		has_transmedia: true
	}
];

export const mockTransmedia: TransmediaItem[] = [
	{
		id: 'tm-echoes-audio',
		media_id: 'echoes-of-glass',
		kind: 'audio',
		title: 'Mira’s Night Diaries',
		description: 'Companion audio drama — listen after episode one.',
		asset_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
		sort_order: 1
	},
	{
		id: 'tm-echoes-lore',
		media_id: 'echoes-of-glass',
		kind: 'document',
		title: 'Lost Letters Archive',
		description: 'Scanned correspondence expanding the glass timeline.',
		file_url: '#',
		sort_order: 2
	},
	{
		id: 'tm-echoes-interact',
		media_id: 'echoes-of-glass',
		kind: 'interactive',
		title: 'Which fragment do you keep?',
		description: 'A branching prompt that unlocks alternate cuts.',
		interactive_payload: [
			{
				id: 'node-1',
				prompt: 'The archive offers two sealed envelopes. Which do you open?',
				options: [
					{ id: 'a', label: 'The red wax seal', outcome: 'Unlocks Audio Diaries Vol. 2' },
					{ id: 'b', label: 'The unmarked kraft envelope', outcome: 'Reveals deleted prologue' }
				]
			}
		],
		sort_order: 3
	},
	{
		id: 'tm-night-audio',
		media_id: 'night-circuit',
		kind: 'audio',
		title: 'Circuit Drift OST',
		asset_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
	},
	{
		id: 'tm-salt-interact',
		media_id: 'salt-and-signal',
		kind: 'interactive',
		title: 'Storm Path',
		interactive_payload: [
			{
				id: 'storm-1',
				prompt: 'The radio crackles. Do you warn the northern pier or the southern dunes?',
				options: [
					{ id: 'n', label: 'Northern pier', outcome: 'Town A survives' },
					{ id: 's', label: 'Southern dunes', outcome: 'Town B survives' }
				]
			}
		]
	}
];

export function getFeaturedMedia(): MediaItem {
	return mockMedia.find((m) => m.featured) ?? mockMedia[0];
}

export function getMediaById(id: string): MediaItem | undefined {
	return mockMedia.find((m) => m.id === id);
}

export function getTransmediaForMedia(mediaId: string): TransmediaItem[] {
	return mockTransmedia
		.filter((t) => t.media_id === mediaId)
		.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

export function getHomeRows(): ContentRowData[] {
	return [
		{
			id: 'trending',
			title: 'Trending on Imperfectu',
			items: mockMedia.slice(0, 6)
		},
		{
			id: 'transmedia',
			title: 'Transmedia Experiences',
			items: mockMedia.filter((m) => m.has_transmedia)
		},
		{
			id: 'experimental',
			title: 'Experimental & Archive',
			items: mockMedia.filter((m) =>
				m.genres.some((g) => g === 'Experimental' || g === 'Documentary')
			)
		},
		{
			id: 'thrillers',
			title: 'Dark Circuits & Thrillers',
			items: mockMedia.filter((m) => m.genres.includes('Thriller') || m.genres.includes('Horror'))
		}
	];
}
