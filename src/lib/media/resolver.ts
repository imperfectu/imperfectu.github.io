import {
	fetchChaptersForMedia,
	fetchFeaturedMedia,
	fetchHomeRows,
	fetchMediaById,
	fetchPublishedMedia,
	fetchTransmediaForMedia
} from '$lib/media/catalog';
import {
	getFeaturedMedia,
	getHomeRows,
	getMediaById,
	getTransmediaForMedia,
	mockMedia
} from '$lib/data/mockMedia';
import type { ContentRowData, MediaItem, TransmediaItem } from '$lib/types';

export async function loadFeaturedMedia(): Promise<MediaItem> {
	return (await fetchFeaturedMedia()) ?? getFeaturedMedia();
}

export async function loadHomeRows(): Promise<ContentRowData[]> {
	return (await fetchHomeRows()) ?? getHomeRows();
}

export async function loadCatalog(): Promise<MediaItem[]> {
	return (await fetchPublishedMedia()) ?? mockMedia;
}

export async function loadMediaById(id: string): Promise<MediaItem | undefined> {
	return (await fetchMediaById(id)) ?? getMediaById(id);
}

export async function loadTransmediaForMedia(mediaId: string): Promise<TransmediaItem[]> {
	return (await fetchTransmediaForMedia(mediaId)) ?? getTransmediaForMedia(mediaId);
}

export async function loadChaptersForMedia(
	mediaId: string
): Promise<{ time: number; label: string }[]> {
	return (
		(await fetchChaptersForMedia(mediaId)) ?? [
			{ time: 0, label: 'Cold open' },
			{ time: 90, label: 'Act I' },
			{ time: 300, label: 'Midpoint' }
		]
	);
}
