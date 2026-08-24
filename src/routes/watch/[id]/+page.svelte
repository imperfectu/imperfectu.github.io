<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import VideoPlayer from '$lib/components/VideoPlayer.svelte';
	import TransmediaHub from '$lib/components/TransmediaHub.svelte';
	import { getMediaById, getTransmediaForMedia } from '$lib/data/mockMedia';
	import {
		loadChaptersForMedia,
		loadMediaById,
		loadTransmediaForMedia
	} from '$lib/media/resolver';
	import type { HubTab, MediaItem, TransmediaItem } from '$lib/types';

	const id = $derived(page.params.id ?? '');

	let media = $state<MediaItem | undefined>();
	let transmedia = $state<TransmediaItem[]>([]);
	let chapters = $state<{ time: number; label: string }[]>([]);
	let loading = $state(true);

	$effect(() => {
		const mediaId = id;
		if (!mediaId) {
			media = undefined;
			transmedia = [];
			chapters = [];
			loading = false;
			return;
		}

		loading = true;
		media = getMediaById(mediaId);
		transmedia = media ? getTransmediaForMedia(media.id) : [];

		void Promise.all([
			loadMediaById(mediaId),
			loadTransmediaForMedia(mediaId),
			loadChaptersForMedia(mediaId)
		]).then(([m, t, c]) => {
			media = m;
			transmedia = t;
			chapters = c;
			loading = false;
		});
	});

	const hubParam = $derived(page.url.searchParams.get('hub'));
	const initialTab = $derived<HubTab>(
		hubParam === 'audio' || hubParam === 'lore' || hubParam === 'interactive' || hubParam === 'narrative'
			? hubParam
			: 'narrative'
	);
</script>

<svelte:head>
	<title>{media ? `${media.title} — Imperfectu` : 'Not found — Imperfectu'}</title>
</svelte:head>

{#if loading}
	<div class="flex min-h-[70vh] items-center justify-center pt-24 text-sm text-zinc-500">Loading…</div>
{:else if !media}
	<div class="flex min-h-[70vh] flex-col items-center justify-center px-4 pt-24 text-center">
		<p class="font-display text-3xl text-white">Title not found</p>
		<a href="{base}/" class="mt-4 text-sm text-[#e50914] hover:underline">Back to home</a>
	</div>
{:else}
	<div class="mx-auto max-w-[1400px] px-4 pt-20 pb-12 sm:px-8 lg:px-12">
		<div class="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
			<div>
				<VideoPlayer
					src={media.main_video_url}
					poster={media.backdrop_url ?? media.thumbnail_url}
					title={media.title}
					{chapters}
				/>
				<div class="mt-4 flex flex-wrap items-end justify-between gap-3">
					<div>
						<h1 class="font-display text-3xl text-white sm:text-4xl">{media.title}</h1>
						<p class="mt-1 text-sm text-zinc-500">
							{media.release_year} · {media.maturity_rating}
							{#if media.duration_minutes}
								· {media.duration_minutes}m
							{/if}
						</p>
					</div>
					<a href="{base}/catalog" class="text-sm text-zinc-400 hover:text-white">Browse catalog</a>
				</div>
			</div>

			<TransmediaHub {media} items={transmedia} {initialTab} />
		</div>
	</div>
{/if}
