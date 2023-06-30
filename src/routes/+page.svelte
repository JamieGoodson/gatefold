<script lang="ts">
	interface Track {
		albumImages: string[];
		albumReleaseYear: string;
		artists: string[];
		name: string;
	}

	const track: Track = {
		albumImages: ['/steely-dan-cover.jpg'],
		albumReleaseYear: '1972',
		artists: ['Steely Dan', 'Donald Fagen', 'Walter Becker'],
		name: 'Dirty Work'
	};
</script>

<div class="w-full h-full flex gap-x-6 items-center justify-center box-border">
	<img src={track.albumImages[0]} class="max-w-lg w-1/2 rounded-lg mb-2" />
	<div class="flex flex-col gap-y-3 w-1/2">
		<div class="text-6xl font-extrabold">{track.name}</div>
		<div class="text-neutral-400 text-2xl font-medium">{track.artists.join(', ')}</div>
		<div class="text-neutral-500 text-xl font-medium">{track.albumReleaseYear}</div>
	</div>
</div>
