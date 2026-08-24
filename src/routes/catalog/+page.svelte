<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import MediaCard from '$lib/components/MediaCard.svelte';
	import { mockMedia } from '$lib/data/mockMedia';
	import { loadCatalog } from '$lib/media/resolver';
	import type { MediaGenre, MediaItem } from '$lib/types';

	const genres: Array<MediaGenre | 'All'> = [
		'All',
		'Drama',
		'Sci-Fi',
		'Thriller',
		'Documentary',
		'Experimental',
		'Horror',
		'Romance',
		'Fantasy',
		'Animation'
	];

	let catalog = $state<MediaItem[]>(mockMedia);
	let genre = $state<MediaGenre | 'All'>('All');
	let transmediaOnly = $state(false);

	onMount(() => {
		void loadCatalog().then((items) => {
			catalog = items;
		});
	});

	$effect(() => {
		const type = page.url.searchParams.get('type');
		transmediaOnly = type === 'transmedia';
	});

	const filtered = $derived(
		catalog.filter((m) => {
			const genreOk = genre === 'All' || m.genres.includes(genre);
			const tmOk = !transmediaOnly || m.has_transmedia;
			return genreOk && tmOk;
		})
	);
</script>

<svelte:head>
	<title>Catalog — Imperfectu</title>
</svelte:head>

<div class="mx-auto max-w-[1800px] px-4 pt-24 pb-16 sm:px-8 lg:px-12">
	<h1 class="font-display text-4xl text-white sm:text-5xl">Catalog</h1>
	<p class="mt-2 max-w-xl text-sm text-zinc-400">
		Filter the library by genre and media type. Transmedia titles include audio, lore, and interactive layers.
	</p>

	<div class="mt-8 flex flex-wrap items-center gap-3">
		<label class="text-xs tracking-wider text-zinc-500 uppercase">
			Genre
			<select
				bind:value={genre}
				class="ml-2 rounded-sm border border-white/15 bg-black/60 px-3 py-2 text-sm normal-case tracking-normal text-zinc-200 outline-none focus:border-[#e50914]"
			>
				{#each genres as g}
					<option value={g}>{g}</option>
				{/each}
			</select>
		</label>

		<label class="ml-2 flex items-center gap-2 text-sm text-zinc-300">
			<input type="checkbox" bind:checked={transmediaOnly} class="accent-[#e50914]" />
			Transmedia only
		</label>
	</div>

	<div class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
		{#each filtered as item (item.id)}
			<div class="w-full min-w-0 [&_a]:w-full [&_a]:max-w-none">
				<MediaCard {item} />
			</div>
		{/each}
	</div>

	{#if filtered.length === 0}
		<p class="mt-12 text-center text-sm text-zinc-500">No titles match these filters.</p>
	{/if}
</div>
