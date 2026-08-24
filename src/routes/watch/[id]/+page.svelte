<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import VideoPlayer from '$lib/components/VideoPlayer.svelte';
	import TransmediaHub from '$lib/components/TransmediaHub.svelte';
	import { getMediaById, getTransmediaForMedia } from '$lib/data/mockMedia';
	import type { HubTab } from '$lib/types';

	const id = $derived(page.params.id ?? '');
	const media = $derived(getMediaById(id));
	const transmedia = $derived(media ? getTransmediaForMedia(media.id) : []);

	const hubParam = $derived(page.url.searchParams.get('hub'));
	const initialTab = $derived<HubTab>(
		hubParam === 'audio' || hubParam === 'lore' || hubParam === 'interactive' || hubParam === 'narrative'
			? hubParam
			: 'narrative'
	);

	const chapters = [
		{ time: 0, label: 'Cold open' },
		{ time: 90, label: 'Act I' },
		{ time: 300, label: 'Midpoint' }
	];
</script>

<svelte:head>
	<title>{media ? `${media.title} — Imperfectu` : 'Not found — Imperfectu'}</title>
</svelte:head>

{#if !media}
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
