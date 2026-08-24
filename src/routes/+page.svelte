<script lang="ts">
	import { onMount } from 'svelte';
	import HeroBanner from '$lib/components/HeroBanner.svelte';
	import ContentRow from '$lib/components/ContentRow.svelte';
	import { getFeaturedMedia, getHomeRows } from '$lib/data/mockMedia';
	import { loadFeaturedMedia, loadHomeRows } from '$lib/media/resolver';
	import type { ContentRowData, MediaItem } from '$lib/types';

	let featured = $state<MediaItem>(getFeaturedMedia());
	let rows = $state<ContentRowData[]>(getHomeRows());

	onMount(() => {
		void Promise.all([loadFeaturedMedia(), loadHomeRows()]).then(([f, r]) => {
			featured = f;
			rows = r;
		});
	});
</script>

<svelte:head>
	<title>Imperfectu — Home</title>
</svelte:head>

<div class="pb-8">
	<HeroBanner item={featured} />

	<!-- Overlap rows onto hero like Netflix -->
	<div class="relative z-20 -mt-16 space-y-2 sm:-mt-24">
		{#each rows as row (row.id)}
			<ContentRow title={row.title} items={row.items} />
		{/each}
	</div>
</div>
