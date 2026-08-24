import { getSupabase } from '$lib/supabaseClient';
import type { Tables } from '$lib/database.types';
import type { InteractiveChoice, MediaItem, TransmediaItem } from '$lib/types';

type MediaRow = Tables<'media_items'> & { has_transmedia?: boolean | null };
type TransmediaRow = Tables<'transmedia_items'>;
type ChapterRow = Tables<'media_chapters'>;

export function mapMediaRow(row: MediaRow): MediaItem {
	return {
		id: row.id,
		title: row.title,
		description: row.description,
		thumbnail_url: row.thumbnail_url,
		backdrop_url: row.backdrop_url ?? undefined,
		trailer_url: row.trailer_url,
		main_video_url: row.main_video_url,
		release_year: row.release_year,
		maturity_rating: row.maturity_rating,
		duration_minutes: row.duration_minutes ?? undefined,
		tags: row.tags ?? [],
		genres: row.genres ?? [],
		cast: row.cast_members ?? [],
		creators: row.creators ?? [],
		featured: row.featured,
		has_transmedia: Boolean(row.has_transmedia)
	};
}

export function mapTransmediaRow(row: TransmediaRow): TransmediaItem {
	return {
		id: row.id,
		media_id: row.media_id,
		kind: row.kind,
		title: row.title,
		description: row.description ?? undefined,
		asset_url: row.asset_url ?? undefined,
		file_url: row.file_url ?? undefined,
		interactive_payload: (row.interactive_payload as InteractiveChoice[] | null) ?? undefined,
		sort_order: row.sort_order
	};
}

export async function fetchPublishedMedia(): Promise<MediaItem[] | null> {
	const supabase = getSupabase();
	if (!supabase) return null;

	const { data, error } = await supabase
		.from('media_with_flags')
		.select('*')
		.order('sort_order', { ascending: true });

	if (error || !data) {
		console.warn('[supabase] fetchPublishedMedia', error?.message);
		return null;
	}

	return data.map((row) => mapMediaRow(row as MediaRow));
}

export async function fetchMediaById(id: string): Promise<MediaItem | null> {
	const supabase = getSupabase();
	if (!supabase) return null;

	const { data, error } = await supabase
		.from('media_with_flags')
		.select('*')
		.eq('id', id)
		.maybeSingle();

	if (error || !data) {
		console.warn('[supabase] fetchMediaById', error?.message);
		return null;
	}

	return mapMediaRow(data as MediaRow);
}

export async function fetchTransmediaForMedia(mediaId: string): Promise<TransmediaItem[] | null> {
	const supabase = getSupabase();
	if (!supabase) return null;

	const { data, error } = await supabase
		.from('transmedia_items')
		.select('*')
		.eq('media_id', mediaId)
		.eq('published', true)
		.order('sort_order', { ascending: true });

	if (error || !data) {
		console.warn('[supabase] fetchTransmediaForMedia', error?.message);
		return null;
	}

	return data.map(mapTransmediaRow);
}

export async function fetchChaptersForMedia(
	mediaId: string
): Promise<{ time: number; label: string }[] | null> {
	const supabase = getSupabase();
	if (!supabase) return null;

	const { data, error } = await supabase
		.from('media_chapters')
		.select('*')
		.eq('media_id', mediaId)
		.order('sort_order', { ascending: true });

	if (error || !data) {
		console.warn('[supabase] fetchChaptersForMedia', error?.message);
		return null;
	}

	return (data as ChapterRow[]).map((c) => ({
		time: Number(c.time_seconds),
		label: c.label
	}));
}
