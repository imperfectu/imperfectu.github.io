<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';

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
	<footer class="mt-16 border-t border-white/5 px-4 py-10 text-center text-xs text-zinc-600 sm:px-8">
		<p class="font-display text-lg tracking-wide text-zinc-500">Imperfectu</p>
		<p class="mt-2">Transmedia experiences · Staging on GitHub Pages</p>
	</footer>
</div>
