<script lang="ts">
	import colors from 'tailwindcss/colors';
	import { afterUpdate, onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import { getAccessToken, getTrack, type Track } from '$lib/spotify';
	import {
		publishTestPlayerEvent,
		setupMqtt,
		type PlayerEventMessage
	} from '$lib/mqtt';
	import type { MqttClient } from 'mqtt';
	import QRCode from 'qrcode';
	import ColorThief from 'colorthief';
	import { getGradientColors, rgbColorToString } from '$lib/util';

	const devMode = import.meta.env.VITE_DEV_MODE === 'true';

	let mainEl: HTMLElement | null;

	let currentTrack: Track | null;
	let spotifyToken: string;
	let mqClient: MqttClient;

	function goFullscreen() {
		if (mainEl) mainEl.requestFullscreen({ navigationUI: 'hide' });
	}

	async function createTrackQrCode(track: Track) {
		console.log('Creating QR code');

		const canvasEl = document.getElementById('qr-code');
		try {
			await QRCode.toCanvas(canvasEl, track.url, { scale: 3 });
		} catch (error) {
			console.error(error);
			throw new Error(
				`Error while generating QR code for track URL ${track.url}`
			);
		}
	}

	function setTestTrack() {
		setCurrentTrack({
			id: '3IvTwPCCjfZczCN2k4qPiH',
			albumImages: ['/steely-dan-cover.jpg'],
			artists: ['Steely Dan', 'Donald Fagen', 'Walter Becker'],
			name: 'Dirty Work',
			url: 'https://open.spotify.com/track/3IvTwPCCjfZczCN2k4qPiH'
		});
	}

	function setCurrentTrack(track: Track | null) {
		currentTrack = track;
		setBackgroundColor(track);
	}

	async function setBackgroundColor(track: Track | null) {
		if (!mainEl) return;
		if (!track) {
			mainEl.style.background = colors.black;
			return;
		}

		const img = document.createElement('img');
		img.crossOrigin = 'anonymous';
		img.src = track.albumImages[0];
		img.addEventListener('load', () => {
			if (!mainEl) return;

			const colorThief = new ColorThief();
			const palette = colorThief.getPalette(img);

			if (!palette) {
				throw new Error('Could not get color palette for album image');
			}

			const gradient = getGradientColors(palette);
			const { brighterColor, darkerColor } = gradient;
			const brigherColorString = brighterColor
				? rgbColorToString(brighterColor)
				: colors.neutral[700];
			const darkerColorString = darkerColor
				? rgbColorToString(darkerColor)
				: colors.neutral[900];

			mainEl.style.background = `linear-gradient(0deg, ${darkerColorString}, ${brigherColorString})`;
		});
	}

	async function onMqttMessageHandler(message: string) {
		const playerEventMessage = JSON.parse(message) as PlayerEventMessage;
		const { playerEvent, trackId, oldTrackId } = playerEventMessage;

		switch (playerEvent) {
			case 'playing':
			case 'changed':
				const track = await getTrack(trackId, spotifyToken);
				setCurrentTrack(track);
				break;
			case 'paused':
			case 'stopped':
				setCurrentTrack(null);
				break;
		}
	}

	onMount(async () => {
		mainEl = document.getElementById('main');
		spotifyToken = await getAccessToken();
		mqClient = setupMqtt(onMqttMessageHandler);

		if (devMode) setTestTrack();
	});

	afterUpdate(() => {
		if (currentTrack) createTrackQrCode(currentTrack);
	});
</script>

<div
	on:click={() => goFullscreen()}
	class="w-full h-full flex gap-x-10 items-center justify-center"
>
	{#if currentTrack}
		<div class="flex w-1/2 justify-end">
			<img
				class="w-full max-w-md rounded-lg mb-2 shadow-md"
				src={currentTrack.albumImages[0]}
				alt="album cover"
			/>
		</div>
		<div class="flex flex-col gap-y-4 w-1/2">
			<div
				class="{currentTrack.name.length > 30
					? 'text-5xl'
					: 'text-6xl'} font-extrabold"
			>
				{currentTrack.name}
			</div>
			<div class="text-neutral-400 text-2xl font-medium">
				{currentTrack.artists.join(', ')}
			</div>
		</div>

		<canvas id="qr-code" class="absolute bottom-0 right-0 m-10 rounded" />
	{/if}
</div>

{#if devMode}
	<div class="absolute bottom-0 left-0 m-10">
		<Button
			on:click={() => publishTestPlayerEvent(mqClient)}
			label="Publish Test Message"
		/>
		<Button on:click={setTestTrack} label="Set Test Track" />
		<Button on:click={() => setCurrentTrack(null)} label="Remove Track" />
	</div>
{/if}
