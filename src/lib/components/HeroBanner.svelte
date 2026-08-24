<script lang="ts">
	import { base } from '$app/paths';
	import { Info, Play, Layers } from '@lucide/svelte';
	import { attachMediaSource, type MediaAttachHandle } from '$lib/media/hls';
	import type { MediaItem } from '$lib/types';

	let {
		item,
		autoplayPreview = true
	}: {
		item: MediaItem;
		autoplayPreview?: boolean;
	} = $props();

	let videoEl: HTMLVideoElement | undefined = $state();
	let muted = $state(true);
	let attachHandle: MediaAttachHandle | null = null;

	$effect(() => {
		const el = videoEl;
		const url = item.trailer_url;
		if (!el || !url) return;

		attachHandle?.destroy();
		attachHandle = attachMediaSource(el, url, {
			autoplay: autoplayPreview,
			muted: true
		});

		return () => {
			attachHandle?.destroy();
			attachHandle = null;
		};
	});

	$effect(() => {
		if (videoEl) videoEl.muted = muted;
	});
</script>

<section class="relative h-[78vh] min-h-[420px] w-full overflow-hidden sm:h-[85vh]">
	<!-- Full-bleed trailer / backdrop plane -->
	{#if item.trailer_url}
		<video
			bind:this={videoEl}
			class="absolute inset-0 h-full w-full object-cover"
			poster={item.backdrop_url ?? item.thumbnail_url}
			loop
			muted={muted}
			playsinline
			preload="metadata"
			aria-hidden="true"
		></video>
	{:else}
		<img
			src={item.backdrop_url ?? item.thumbnail_url}
			alt=""
			class="absolute inset-0 h-full w-full object-cover"
		/>
	{/if}

	<!-- Bottom / side cinematic gradients -->
	<div
		class="pointer-events-none absolute inset-0 bg-gradient-to-r from-black via-black/55 to-transparent"
	></div>
	<div
		class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-black/40 to-transparent"
	></div>

	<div class="relative z-10 flex h-full max-w-[1800px] flex-col justify-end px-4 pb-16 sm:px-8 sm:pb-24 lg:px-12">
		<p class="mb-2 font-display text-sm tracking-[0.2em] text-[#e50914] uppercase">
			Featured Experience
		</p>
		<h1 class="font-display max-w-3xl text-4xl leading-none text-white sm:text-6xl lg:text-7xl">
			{item.title}
		</h1>
		<p class="mt-4 max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base">
			{item.description}
		</p>

		<div class="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-400 sm:text-sm">
			<span class="rounded border border-zinc-500 px-1.5 py-0.5 font-medium text-zinc-200">
				{item.maturity_rating}
			</span>
			<span>{item.release_year}</span>
			{#if item.duration_minutes}
				<span>{item.duration_minutes}m</span>
			{/if}
			{#each item.genres.slice(0, 2) as genre}
				<span class="text-zinc-500">·</span>
				<span>{genre}</span>
			{/each}
		</div>

		<div class="mt-6 flex flex-wrap items-center gap-3">
			<a
				href="{base}/watch/{item.id}"
				class="inline-flex items-center gap-2 rounded bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
			>
				<Play class="size-5 fill-current" aria-hidden="true" />
				Play
			</a>
			<a
				href="{base}/watch/{item.id}?hub=interactive"
				class="inline-flex items-center gap-2 rounded bg-white/15 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/25"
			>
				<Layers class="size-5" aria-hidden="true" />
				Explore Experience
			</a>
			<a
				href="{base}/watch/{item.id}?hub=narrative"
				class="inline-flex items-center gap-2 rounded bg-white/10 px-5 py-2.5 text-sm font-medium text-zinc-100 backdrop-blur-md transition hover:bg-white/20"
			>
				<Info class="size-5" aria-hidden="true" />
				More Info
			</a>

			<button
				type="button"
				class="ml-1 rounded-full border border-white/30 px-3 py-2 text-xs text-zinc-300 transition hover:border-white hover:text-white"
				onclick={() => {
					muted = !muted;
				}}
			>
				{muted ? 'Unmute' : 'Mute'}
			</button>
		</div>
	</div>
</section>
