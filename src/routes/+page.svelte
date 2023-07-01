<script lang="ts">
	import { onMount } from 'svelte';
	import mqtt, { MqttClient } from 'mqtt/dist/mqtt';
	import Button from '$lib/components/Button.svelte';
	import { getAccessToken, getTrack, type Track } from '$lib/spotify';

	type PlayerEvent = 'start' | 'stop' | 'change';

	interface PlayerEventMessage {
		playerEvent: PlayerEvent;
		oldTrackId: string;
		trackId: string;
	}

	const playerEventTopic = 'librespot/playerEvent';
	const mqttBrokerUrl = import.meta.env.VITE_MQTT_BROKER_URL;
	let currentTrack: Track | null;
	let mainEl: HTMLElement | null;
	let mqClient: MqttClient;

	function goFullscreen() {
		if (mainEl) mainEl.requestFullscreen({ navigationUI: 'hide' });
	}

	function pubTestPlayerEvent() {
		console.log(`Publishing test message to topic: ${playerEventTopic}`);
		mqClient.publish(
			playerEventTopic,
			JSON.stringify({
				playerEvent: 'start',
				trackId: '2sCaihW0VlDKecbUgMSzRY'
			})
		);
	}

	function setTestTrack() {
		currentTrack = {
			id: '3IvTwPCCjfZczCN2k4qPiH',
			albumImages: ['/steely-dan-cover.jpg'],
			artists: ['Steely Dan', 'Donald Fagen', 'Walter Becker'],
			name: 'Dirty Work'
		};
	}

	function setupMqtt(spotifyToken: string) {
		console.log(`Connecting to MQTT broker at ${mqttBrokerUrl}`);
		mqClient = mqtt.connect(mqttBrokerUrl);

		mqClient.on('connect', () => {
			console.log('MQTT: connect');
			mqClient.subscribe(playerEventTopic);
		});

		mqClient.on('disconnect', () => {
			console.log('MQTT: disconnect');
		});

		mqClient.on('offline', function () {
			console.log('MQTT: offline');
		});

		mqClient.on('reconnect', function () {
			console.log('MQTT: reconnect');
		});

		mqClient.on('error', (error) => {
			console.log('MQTT: error');
			console.error(error);
		});

		mqClient.on('message', async (topic, messageRaw) => {
			console.log('MQTT: message');

			const message = messageRaw.toString();
			console.log(`MQTT: ${message}`);

			if (!message || message == '{}') {
				console.warn('MQTT: Empty message. Ignoring...');
				return;
			}

			switch (topic) {
				case playerEventTopic:
					const playerEventMessage = JSON.parse(message) as PlayerEventMessage;
					if (playerEventMessage.playerEvent === 'stop') {
						currentTrack = null;
					} else {
						const trackId = playerEventMessage.trackId;
						currentTrack = await getTrack(trackId, spotifyToken);
					}

					break;
				default:
					console.error(`MQTT: Unknown topic: ${topic}`);
			}
		});
	}

	onMount(async () => {
		mainEl = document.getElementById('main');
		const spotifyToken = await getAccessToken();
		setupMqtt(spotifyToken);
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
		<Button on:click={pubTestPlayerEvent} label="Publish Test Message" />
		<Button on:click={setTestTrack} label="Set Test Track" />
	</div>
{/if}
