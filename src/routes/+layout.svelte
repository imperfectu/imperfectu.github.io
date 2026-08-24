<script lang="ts">
	import './layout.css';
	import { base } from '$app/paths';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';
	import { brand, socialLinks } from '$lib/content/about';

	let { children } = $props();
	let scrolled = $state(false);

	$effect(() => {
		const onScroll = () => {
			scrolled = window.scrollY > 40;
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap"
		rel="stylesheet"
	/>
	<title>Imperfectu — Transmedia Streaming</title>
	<meta
		name="description"
		content="A niche transmedia streaming platform for interactive storytelling, audio lore, and cinematic experiences."
	/>
</svelte:head>

<div class="min-h-dvh text-zinc-100">
	<Navbar {scrolled} />
	<main>
		{@render children()}
	</main>
	<footer class="mt-16 border-t border-white/5 px-4 py-10 sm:px-8">
		<div class="mx-auto flex max-w-[1200px] flex-col items-center gap-6 text-center">
			<a href="{base}/">
				<img
					src="{base}{brand.logo}"
					alt={brand.logoAlt}
					class="mx-auto h-8 w-auto opacity-80 transition hover:opacity-100"
					width="157"
					height="36"
				/>
			</a>
			<nav class="flex flex-wrap justify-center gap-4 text-xs text-zinc-500">
				{#each socialLinks as link}
					<a
						href={link.href}
						class="transition hover:text-zinc-300"
						target="_blank"
						rel="noopener noreferrer"
					>
						{link.label}
					</a>
				{/each}
				<a href="{base}/about" class="transition hover:text-zinc-300">About</a>
			</nav>
			<p class="text-xs text-zinc-600">© {new Date().getFullYear()} Imperfectu. All rights reserved.</p>
		</div>
	</footer>
</div>
