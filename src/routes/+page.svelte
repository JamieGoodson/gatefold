<script lang="ts">
	import { onMount } from 'svelte';
	import mqtt from 'mqtt/dist/mqtt';

	interface Track {
		albumImages: string[];
		artists: string[];
		name: string;
	}

	enum Topic {
		TrackId = 'raspotify/trackId'
	}

	// Demo track
	// let track: Track = {
	// 	albumImages: ['/steely-dan-cover.jpg'],
	// 	artists: ['Steely Dan', 'Donald Fagen', 'Walter Becker'],
	// 	name: 'Dirty Work'
	// };

	let track: Track | null;
	let mainEl: HTMLElement | null;

	function goFullscreen() {
		if (mainEl) mainEl.requestFullscreen();
	}

	onMount(() => {
		mainEl = document.getElementById('main');

		const mqClientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8);
		const mqOptions = {
			keepalive: 60,
			clientId: mqClientId,
			protocolId: 'MQTT',
			protocolVersion: 4,
			clean: true,
			reconnectPeriod: 1000,
			connectTimeout: 30 * 1000
		};
		const mqClient = mqtt.connect('ws://broker.emqx.io:8083/mqtt', mqOptions);

		mqClient.on('connect', () => {
			mqClient.subscribe(Topic.TrackId);

			// Test
			// mqClient.publish(Topic.TrackId, 'testTrackId');
		});

		mqClient.on('message', (topic, message) => {
			console.log(topic);
			console.log(message.toString());

			switch (topic) {
				case Topic.TrackId:
					// TODO: Get track from spotify
					break;
				default:
					console.error(`Unknown topic: ${topic}`);
			}

			mqClient.end();
		});
	});
</script>

<div on:click={() => goFullscreen()} class="w-full h-full flex gap-x-6 items-center justify-center">
	{#if track}
		<div class="flex w-1/2 justify-end">
			<img class="w-full max-w-lg rounded-lg mb-2" src={track.albumImages[0]} alt="album cover" />
		</div>
		<div class="flex flex-col gap-y-4 w-1/2">
			<div class="text-6xl font-extrabold">{track.name}</div>
			<div class="text-neutral-400 text-2xl font-medium">{track.artists.join(', ')}</div>
		</div>
	{:else}
		<div>No track</div>
	{/if}
</div>
