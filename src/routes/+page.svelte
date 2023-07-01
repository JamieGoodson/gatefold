<script lang="ts">
	import { onMount } from 'svelte';
	import mqtt, { MqttClient, type IClientOptions } from 'mqtt/dist/mqtt';
	import Button from '$lib/components/Button.svelte';
	import type { Track } from '$lib/spotify';

	enum Topic {
		TrackId = 'librespot/trackId'
	}

	const mqttBrokerUrl = import.meta.env.VITE_MQTT_BROKER_URL;
	let currentTrack: Track | null;
	let mainEl: HTMLElement | null;
	let mqClient: MqttClient;

	function goFullscreen() {
		if (mainEl) mainEl.requestFullscreen({ navigationUI: 'hide' });
	}

	function pubTestTrackId() {
		console.log(`Publishing test message to topic: ${Topic.TrackId}`);
		mqClient.publish(Topic.TrackId, 'testTrackId');
	}

	function setTestTrack() {
		currentTrack = {
			id: '11dFghVXANMlKmJXsNCbNl',
			albumImages: ['/steely-dan-cover.jpg'],
			artists: ['Steely Dan', 'Donald Fagen', 'Walter Becker'],
			name: 'Dirty Work'
		};
	}

	onMount(() => {
		mainEl = document.getElementById('main');

		const mqClientId = 'mqttjs_JamieGLibrespot';

		console.log(
			`Connecting to MQTT broker at ${mqttBrokerUrl} with clientId ${mqClientId}`
		);

		mqClient = mqtt.connect(mqttBrokerUrl, {
			clientId: mqClientId
		});

		mqClient.on('connect', () => {
			console.log(`Connected to MQTT broker`);
			mqClient.subscribe(Topic.TrackId);
		});

		mqClient.on('message', (topic, message) => {
			console.log(message.toString());

			switch (topic) {
				case Topic.TrackId:
					// TODO: Get track from spotify
					break;
				default:
					console.error(`Unknown topic: ${topic}`);
			}
		});
	});
</script>

<div
	on:click={() => goFullscreen()}
	class="w-full h-full flex gap-x-10 items-center justify-center"
>
	{#if currentTrack}
		<div class="flex w-1/2 justify-end">
			<img
				class="w-full max-w-md rounded-lg mb-2"
				src={currentTrack.albumImages[0]}
				alt="album cover"
			/>
		</div>
		<div class="flex flex-col gap-y-4 w-1/2">
			<div class="text-6xl font-extrabold">{currentTrack.name}</div>
			<div class="text-neutral-400 text-2xl font-medium">
				{currentTrack.artists.join(', ')}
			</div>
		</div>
	{/if}
</div>

{#if import.meta.env.VITE_DEV_MODE}
	<div class="absolute bottom-0 left-0 m-4">
		<Button on:click={pubTestTrackId} label="Publish Test Message" />
		<Button on:click={setTestTrack} label="Set Test Track" />
	</div>
{/if}
