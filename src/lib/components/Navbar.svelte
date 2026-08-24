<script lang="ts">
	import { base } from '$app/paths';
	import { Search, Bell, ChevronDown } from '@lucide/svelte';
	import { brand } from '$lib/content/about';

	let { scrolled = false }: { scrolled?: boolean } = $props();

	let query = $state('');
	let searchOpen = $state(false);
</script>

<header
	class="fixed inset-x-0 top-0 z-50 transition-colors duration-300
		{scrolled
		? 'border-b border-white/5 bg-black/80 backdrop-blur-xl'
		: 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'}"
>
	<nav class="mx-auto flex h-16 max-w-[1800px] items-center gap-6 px-4 sm:px-8 lg:px-12">
		<a href="{base}/" class="group shrink-0">
			<img
				src="{base}{brand.logo}"
				alt={brand.logoAlt}
				class="h-8 w-auto transition group-hover:opacity-90 sm:h-9"
				width="157"
				height="36"
			/>
			<span class="sr-only">Imperfectu Home</span>
		</a>

		<ul class="hidden items-center gap-5 text-sm text-zinc-300 md:flex">
			<li>
				<a href="{base}/" class="transition hover:text-white">Home</a>
			</li>
			<li>
				<a href="{base}/catalog" class="transition hover:text-white">Catalog</a>
			</li>
			<li>
				<a href="{base}/catalog?type=transmedia" class="transition hover:text-white">Experiences</a>
			</li>
			<li>
				<a href="{base}/about" class="transition hover:text-white">About</a>
			</li>
		</ul>

		<div class="ml-auto flex items-center gap-3 sm:gap-4">
			{#if searchOpen}
				<label class="flex items-center gap-2 rounded-sm border border-white/20 bg-black/60 px-3 py-1.5">
					<Search class="size-4 text-zinc-400" aria-hidden="true" />
					<input
						bind:value={query}
						type="search"
						placeholder="Titles, lore, audio…"
						class="w-36 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500 sm:w-48"
						aria-label="Search catalog"
					/>
				</label>
			{:else}
				<button
					type="button"
					class="rounded-full p-2 text-zinc-200 transition hover:bg-white/10 hover:text-white"
					aria-label="Open search"
					onclick={() => (searchOpen = true)}
				>
					<Search class="size-5" />
				</button>
			{/if}

			<button
				type="button"
				class="hidden rounded-full p-2 text-zinc-200 transition hover:bg-white/10 sm:inline-flex"
				aria-label="Notifications"
			>
				<Bell class="size-5" />
			</button>

			<button
				type="button"
				class="flex items-center gap-2 rounded-sm text-sm text-zinc-200 transition hover:text-white"
				aria-label="Profile menu"
			>
				<span
					class="flex size-8 items-center justify-center rounded-sm bg-gradient-to-br from-[#e50914] to-red-900 text-xs font-semibold text-white"
				>
					IU
				</span>
				<ChevronDown class="hidden size-4 sm:block" aria-hidden="true" />
			</button>
		</div>
	</nav>
</header>
