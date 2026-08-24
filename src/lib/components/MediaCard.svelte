<script lang="ts">
	import { base } from '$app/paths';
	import { Play, Layers } from '@lucide/svelte';
	import type { MediaItem } from '$lib/types';

	let { item }: { item: MediaItem } = $props();

	const badge = $derived.by(() => {
		if (!item.has_transmedia) return null;
		if (item.tags.some((t) => /interactive/i.test(t))) return 'Interactive';
		if (item.tags.some((t) => /audio/i.test(t))) return 'Audio Lore Available';
		return 'Transmedia';
	});
</script>

<a
	href="{base}/watch/{item.id}"
	class="group relative block w-[42vw] max-w-[280px] min-w-[160px] shrink-0 snap-start outline-none sm:w-[28vw] lg:w-[18vw]"
>
	<div
		class="relative aspect-video overflow-hidden rounded-sm bg-zinc-900 shadow-lg transition-all duration-300 group-hover:z-20 group-hover:scale-105 group-hover:shadow-2xl group-focus-visible:scale-105"
	>
		<img
			src={item.thumbnail_url}
			alt=""
			class="h-full w-full object-cover transition duration-500 group-hover:brightness-75"
			loading="lazy"
		/>

		{#if badge}
			<span
				class="absolute top-2 left-2 rounded-sm bg-[#e50914]/90 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase backdrop-blur-sm"
			>
				{badge}
			</span>
		{/if}

		<div
			class="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100"
		>
			<span class="flex size-12 items-center justify-center rounded-full bg-white/95 text-black shadow-lg">
				<Play class="size-6 fill-current" aria-hidden="true" />
			</span>
		</div>

		<div
			class="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black via-black/80 to-transparent p-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
		>
			<p class="truncate text-sm font-semibold text-white">{item.title}</p>
			<div class="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-zinc-400">
				<span>{item.release_year}</span>
				<span>·</span>
				<span>{item.maturity_rating}</span>
				{#if item.has_transmedia}
					<span class="inline-flex items-center gap-0.5 text-[#ff6b73]">
						<Layers class="size-3" aria-hidden="true" />
						Extra
					</span>
				{/if}
			</div>
			{#if item.tags.length}
				<p class="mt-1 truncate text-[10px] text-zinc-500">{item.tags.slice(0, 3).join(' · ')}</p>
			{/if}
		</div>
	</div>
	<span class="sr-only">Play {item.title}</span>
</a>
