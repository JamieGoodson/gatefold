<script lang="ts">
	import { onMount } from 'svelte';

	interface Track {
		albumImages: string[];
		artists: string[];
		name: string;
	}

	const track: Track = {
		albumImages: ['/steely-dan-cover.jpg'],
		artists: ['Steely Dan', 'Donald Fagen', 'Walter Becker'],
		name: 'Dirty Work'
	};

	let mainEl: HTMLElement | null;

	function goFullscreen() {
		if (mainEl) mainEl.requestFullscreen();
	}

	onMount(() => {
		mainEl = document.getElementById('main');
	});
</script>

<div on:click={() => goFullscreen()} class="w-full h-full flex gap-x-6 items-center justify-center">
	<div class="flex w-1/2 justify-end">
		<img class="w-full max-w-lg rounded-lg mb-2" src={track.albumImages[0]} alt="album cover" />
	</div>
	<div class="flex flex-col gap-y-4 w-1/2">
		<div class="text-6xl font-extrabold">{track.name}</div>
		<div class="text-neutral-400 text-2xl font-medium">{track.artists.join(', ')}</div>
	</div>
</div>
