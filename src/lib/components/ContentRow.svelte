<script lang="ts">
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import MediaCard from './MediaCard.svelte';
	import type { MediaItem } from '$lib/types';

	let {
		title,
		items
	}: {
		title: string;
		items: MediaItem[];
	} = $props();

	let scroller: HTMLDivElement | undefined = $state();

	function scrollBy(dir: -1 | 1) {
		if (!scroller) return;
		const amount = Math.min(scroller.clientWidth * 0.85, 720);
		scroller.scrollBy({ left: dir * amount, behavior: 'smooth' });
	}
</script>

<section class="group/row relative py-3 sm:py-5">
	<h2 class="mb-3 px-4 font-display text-lg tracking-wide text-zinc-100 sm:px-8 sm:text-xl lg:px-12">
		{title}
	</h2>

	<div class="relative">
		<button
			type="button"
			class="absolute top-0 bottom-0 left-0 z-20 hidden w-10 items-center justify-center bg-black/50 text-white opacity-0 backdrop-blur-sm transition group-hover/row:opacity-100 hover:bg-black/70 md:flex"
			aria-label="Scroll {title} left"
			onclick={() => scrollBy(-1)}
		>
			<ChevronLeft class="size-8" />
		</button>

		<div
			bind:this={scroller}
			class="scrollbar-hide flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth px-4 pb-2 sm:gap-3 sm:px-8 lg:px-12"
		>
			{#each items as item (item.id)}
				<MediaCard {item} />
			{/each}
		</div>

		<button
			type="button"
			class="absolute top-0 bottom-0 right-0 z-20 hidden w-10 items-center justify-center bg-black/50 text-white opacity-0 backdrop-blur-sm transition group-hover/row:opacity-100 hover:bg-black/70 md:flex"
			aria-label="Scroll {title} right"
			onclick={() => scrollBy(1)}
		>
			<ChevronRight class="size-8" />
		</button>
	</div>
</section>
