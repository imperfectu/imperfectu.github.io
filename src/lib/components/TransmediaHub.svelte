<script lang="ts">
	import type { HubTab, InteractiveChoice, MediaItem, TransmediaItem } from '$lib/types';

	let {
		media,
		items,
		initialTab = 'narrative' as HubTab
	}: {
		media: MediaItem;
		items: TransmediaItem[];
		initialTab?: HubTab;
	} = $props();

	let tab = $state<HubTab>('narrative');
	let selectedOutcome = $state<string | null>(null);
	let syncedFrom = $state<HubTab | null>(null);

	const tabs: { id: HubTab; label: string }[] = [
		{ id: 'narrative', label: 'Main Narrative' },
		{ id: 'audio', label: 'Audio Experience' },
		{ id: 'lore', label: 'Lore & Archive' },
		{ id: 'interactive', label: 'Branching / Interactive' }
	];

	const audioItems = $derived(items.filter((i) => i.kind === 'audio'));
	const loreItems = $derived(items.filter((i) => i.kind === 'document' || i.kind === 'download'));
	const interactiveItems = $derived(items.filter((i) => i.kind === 'interactive'));

	function choose(optionLabel: string, outcome?: string) {
		selectedOutcome = outcome ?? `You chose: ${optionLabel}`;
	}

	$effect(() => {
		if (syncedFrom !== initialTab) {
			tab = initialTab;
			syncedFrom = initialTab;
		}
	});
</script>

<div class="rounded-sm border border-white/10 bg-zinc-950/80 backdrop-blur-xl">
	<div class="flex gap-1 overflow-x-auto border-b border-white/10 px-2 pt-2 scrollbar-hide sm:px-4">
		{#each tabs as t}
			<button
				type="button"
				class="shrink-0 border-b-2 px-3 py-3 text-sm transition
					{tab === t.id
					? 'border-[#e50914] text-white'
					: 'border-transparent text-zinc-500 hover:text-zinc-300'}"
				onclick={() => (tab = t.id)}
			>
				{t.label}
			</button>
		{/each}
	</div>

	<div class="p-4 sm:p-6">
		{#if tab === 'narrative'}
			<div class="space-y-4">
				<p class="max-w-3xl text-sm leading-relaxed text-zinc-300 sm:text-base">{media.description}</p>
				{#if media.creators?.length}
					<div>
						<h3 class="text-xs font-semibold tracking-wider text-zinc-500 uppercase">Creators</h3>
						<p class="mt-1 text-sm text-zinc-200">{media.creators.join(', ')}</p>
					</div>
				{/if}
				{#if media.cast?.length}
					<div>
						<h3 class="text-xs font-semibold tracking-wider text-zinc-500 uppercase">Cast</h3>
						<p class="mt-1 text-sm text-zinc-200">{media.cast.join(', ')}</p>
					</div>
				{/if}
				<div class="flex flex-wrap gap-2">
					{#each media.tags as tag}
						<span class="rounded-sm bg-white/5 px-2 py-1 text-xs text-zinc-400">{tag}</span>
					{/each}
				</div>
			</div>
		{:else if tab === 'audio'}
			{#if audioItems.length === 0}
				<p class="text-sm text-zinc-500">No companion audio for this title yet.</p>
			{:else}
				<ul class="space-y-4">
					{#each audioItems as audio}
						<li class="rounded-sm border border-white/5 bg-black/40 p-4">
							<p class="font-medium text-white">{audio.title}</p>
							{#if audio.description}
								<p class="mt-1 text-sm text-zinc-400">{audio.description}</p>
							{/if}
							{#if audio.asset_url}
								<audio class="mt-3 w-full" controls preload="none" src={audio.asset_url}>
									<source src={audio.asset_url} type="audio/mpeg" />
								</audio>
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
		{:else if tab === 'lore'}
			{#if loreItems.length === 0}
				<p class="text-sm text-zinc-500">Archive materials coming soon.</p>
			{:else}
				<ul class="space-y-3">
					{#each loreItems as doc}
						<li class="overflow-hidden rounded-sm border border-white/5">
							<details class="group bg-black/40 open:bg-black/60">
								<summary
									class="cursor-pointer list-none px-4 py-3 text-sm font-medium text-zinc-100 marker:content-none [&::-webkit-details-marker]:hidden"
								>
									{doc.title}
								</summary>
								<div class="border-t border-white/5 px-4 py-3 text-sm text-zinc-400">
									{#if doc.description}
										<p>{doc.description}</p>
									{/if}
									{#if doc.file_url}
										<a
											href={doc.file_url}
											class="mt-3 inline-flex text-[#ff6b73] underline-offset-2 hover:underline"
											target="_blank"
											rel="noopener noreferrer"
										>
											Open document
										</a>
									{/if}
								</div>
							</details>
						</li>
					{/each}
				</ul>
			{/if}
		{:else}
			{#if interactiveItems.length === 0}
				<p class="text-sm text-zinc-500">No branching elements for this title.</p>
			{:else}
				<div class="space-y-6">
					{#each interactiveItems as block}
						{@const nodes = (block.interactive_payload ?? []) as InteractiveChoice[]}
						<div>
							<h3 class="text-base font-semibold text-white">{block.title}</h3>
							{#if block.description}
								<p class="mt-1 text-sm text-zinc-400">{block.description}</p>
							{/if}
							{#each nodes as node}
								<div class="mt-4 rounded-sm border border-[#e50914]/30 bg-[#e50914]/5 p-4">
									<p class="text-sm text-zinc-200">{node.prompt}</p>
									<div class="mt-3 flex flex-wrap gap-2">
										{#each node.options as opt}
											<button
												type="button"
												class="rounded bg-white/10 px-3 py-2 text-sm text-white transition hover:bg-[#e50914]"
												onclick={() => choose(opt.label, opt.outcome)}
											>
												{opt.label}
											</button>
										{/each}
									</div>
								</div>
							{/each}
						</div>
					{/each}
					{#if selectedOutcome}
						<p class="rounded-sm border border-white/10 bg-black/50 px-4 py-3 text-sm text-[#ff6b73]">
							{selectedOutcome}
						</p>
					{/if}
				</div>
			{/if}
		{/if}
	</div>
</div>
