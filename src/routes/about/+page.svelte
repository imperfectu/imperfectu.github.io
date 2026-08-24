<script lang="ts">
	import { base } from '$app/paths';
	import { aboutHistory, aboutMission, founder } from '$lib/content/about';
</script>

<svelte:head>
	<title>About — Imperfectu</title>
	<meta
		name="description"
		content="Imperfectu: Festival Internacional de Cine y Estudios de Género — historia, misión y fundadora Josefina Mata Zetina."
	/>
</svelte:head>

<div class="mx-auto max-w-[1200px] px-4 pt-24 pb-16 sm:px-8 lg:px-12">
	<header class="mb-12 max-w-3xl">
		<p class="font-display text-sm tracking-[0.2em] text-[#e50914] uppercase">Our story</p>
		<h1 class="font-display mt-2 text-4xl text-white sm:text-5xl lg:text-6xl">
			<span class="text-zinc-400">{aboutMission.headingLead}</span>
			{' '}{aboutMission.headingRest}
		</h1>
	</header>

	<div class="grid gap-8 lg:grid-cols-2 lg:gap-10">
		<section
			class="rounded-sm border border-white/10 bg-zinc-950/60 p-6 backdrop-blur-xl sm:p-8"
		>
			<p class="text-sm leading-relaxed text-zinc-300 sm:text-base sm:leading-8">
				{aboutMission.lead}
			</p>
		</section>

		<section
			class="rounded-sm border border-[#e50914]/30 bg-[#e50914]/10 p-6 backdrop-blur-xl sm:p-8"
		>
			{#each aboutHistory as paragraph}
				<p class="text-sm leading-relaxed text-zinc-200 sm:text-base sm:leading-8 {paragraph !== aboutHistory.at(-1) ? 'mb-5' : ''}">
					{paragraph}
				</p>
			{/each}
		</section>
	</div>

	<section class="mt-14">
		<h2 class="font-display mb-8 text-2xl tracking-wide text-white sm:text-3xl">Founder</h2>
		<figure
			class="group mx-auto max-w-sm overflow-hidden rounded-sm border border-white/10 bg-zinc-950/80 shadow-2xl backdrop-blur-xl"
		>
			<div class="aspect-[4/5] overflow-hidden bg-zinc-900">
				<img
					src="{base}{founder.image}"
					alt={founder.imageAlt}
					class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
					loading="lazy"
				/>
			</div>
			<figcaption class="border-t border-white/10 px-5 py-4 text-center">
				<h3 class="text-lg font-semibold text-white">{founder.name}</h3>
				<p class="mt-1 text-xs tracking-[0.15em] text-[#e50914] uppercase">{founder.role}</p>
			</figcaption>
		</figure>
	</section>
</div>
