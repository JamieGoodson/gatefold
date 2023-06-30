<script lang="ts">
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
</script>

<div class="w-full h-full flex gap-x-6 items-center justify-center">
	<div class="flex w-1/2 justify-end">
		<img class="w-full max-w-lg rounded-lg mb-2" src={track.albumImages[0]} />
	</div>
	<div class="flex flex-col gap-y-3 w-1/2">
		<div class="text-6xl font-extrabold">{track.name}</div>
		<div class="text-neutral-400 text-2xl font-medium">{track.artists.join(', ')}</div>
	</div>
</div>
