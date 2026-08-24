<script lang="ts">
	import { Maximize, Minimize, Pause, Play } from '@lucide/svelte';
	import { attachMediaSource, isHlsUrl, type MediaAttachHandle } from '$lib/media/hls';

	let {
		src,
		poster = '',
		title = 'Now playing',
		chapters = [] as { time: number; label: string }[]
	}: {
		src: string;
		poster?: string;
		title?: string;
		chapters?: { time: number; label: string }[];
	} = $props();

	let video: HTMLVideoElement | undefined = $state();
	let playing = $state(false);
	let current = $state(0);
	let duration = $state(0);
	let rate = $state(1);
	let isFullscreen = $state(false);
	let container: HTMLDivElement | undefined = $state();
	let errorMessage = $state<string | null>(null);
	let attachHandle: MediaAttachHandle | null = null;

	$effect(() => {
		const el = video;
		const url = src;
		if (!el || !url) return;

		errorMessage = null;
		attachHandle?.destroy();
		attachHandle = attachMediaSource(el, url, {
			onFatalError: (message) => {
				errorMessage = message;
			}
		});

		return () => {
			attachHandle?.destroy();
			attachHandle = null;
		};
	});

	function togglePlay() {
		if (!video) return;
		if (video.paused) {
			void video.play();
		} else {
			video.pause();
		}
	}

	function onTime() {
		if (!video) return;
		current = video.currentTime;
		duration = video.duration || 0;
	}

	function seek(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		if (!video) return;
		video.currentTime = Number(input.value);
	}

	function cycleRate() {
		const rates = [0.75, 1, 1.25, 1.5, 2];
		const next = rates[(rates.indexOf(rate) + 1) % rates.length];
		rate = next;
		if (video) video.playbackRate = next;
	}

	async function toggleFullscreen() {
		if (!container) return;
		if (!document.fullscreenElement) {
			await container.requestFullscreen();
			isFullscreen = true;
		} else {
			await document.exitFullscreen();
			isFullscreen = false;
		}
	}

	function jumpChapter(time: number) {
		if (!video) return;
		video.currentTime = time;
		void video.play();
	}

	function fmt(s: number) {
		if (!Number.isFinite(s)) return '0:00';
		const m = Math.floor(s / 60);
		const sec = Math.floor(s % 60)
			.toString()
			.padStart(2, '0');
		return `${m}:${sec}`;
	}

	const streamingLabel = $derived(isHlsUrl(src) ? 'HLS' : 'MP4');
</script>

<div
	bind:this={container}
	class="group relative overflow-hidden rounded-sm bg-black shadow-2xl ring-1 ring-white/10"
>
	<video
		bind:this={video}
		class="aspect-video w-full bg-black"
		{poster}
		playsinline
		preload="metadata"
		onplay={() => (playing = true)}
		onpause={() => (playing = false)}
		ontimeupdate={onTime}
		onloadedmetadata={onTime}
		onclick={togglePlay}
	>
		<track kind="captions" />
	</video>

	{#if errorMessage}
		<div class="absolute inset-0 flex items-center justify-center bg-black/80 px-6 text-center">
			<p class="text-sm text-red-300">{errorMessage}</p>
		</div>
	{/if}

	<div
		class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent px-3 pt-16 pb-3 opacity-100 transition sm:px-4 sm:opacity-0 sm:group-hover:opacity-100"
	>
		<div class="mb-2 flex items-center gap-2">
			<p class="truncate text-xs text-zinc-400 sm:text-sm">{title}</p>
			<span class="shrink-0 rounded bg-white/10 px-1.5 py-0.5 text-[10px] tracking-wide text-zinc-400 uppercase">
				{streamingLabel}
			</span>
		</div>

		<input
			type="range"
			min="0"
			max={duration || 0}
			step="0.1"
			value={current}
			class="mb-2 h-1 w-full cursor-pointer accent-[#e50914]"
			aria-label="Seek"
			oninput={seek}
		/>

		{#if chapters.length}
			<div class="mb-2 flex flex-wrap gap-1.5">
				{#each chapters as ch}
					<button
						type="button"
						class="rounded bg-white/10 px-2 py-0.5 text-[10px] text-zinc-300 transition hover:bg-white/20"
						onclick={() => jumpChapter(ch.time)}
					>
						{ch.label}
					</button>
				{/each}
			</div>
		{/if}

		<div class="flex items-center gap-3 text-white">
			<button type="button" class="rounded p-1.5 hover:bg-white/10" aria-label="Play or pause" onclick={togglePlay}>
				{#if playing}
					<Pause class="size-5 fill-current" />
				{:else}
					<Play class="size-5 fill-current" />
				{/if}
			</button>
			<span class="text-xs tabular-nums text-zinc-300">{fmt(current)} / {fmt(duration)}</span>
			<button
				type="button"
				class="ml-auto rounded px-2 py-1 text-xs text-zinc-300 hover:bg-white/10"
				onclick={cycleRate}
			>
				{rate}x
			</button>
			<button
				type="button"
				class="rounded p-1.5 hover:bg-white/10"
				aria-label="Fullscreen"
				onclick={toggleFullscreen}
			>
				{#if isFullscreen}
					<Minimize class="size-5" />
				{:else}
					<Maximize class="size-5" />
				{/if}
			</button>
		</div>
	</div>
</div>
