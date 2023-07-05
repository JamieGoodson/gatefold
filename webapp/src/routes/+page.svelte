<script lang="ts">
	import colors from 'tailwindcss/colors';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import { getTrack, type Track } from '$lib/spotify';
	import {
		publishTestPlayerEvent,
		setupMqtt,
		type PlayerEventMessage
	} from '$lib/mqtt';
	import type { MqttClient } from 'mqtt';
	import QRCode from 'qrcode';
	import ColorThief from 'colorthief';
	import { getGradientColors, rgbColorToString } from '$lib/util';
	import NoSleep from 'nosleep.js';

	const devMode = import.meta.env.VITE_DEV_MODE === 'true';

	let mainEl: HTMLElement;
	let canvasEl: HTMLCanvasElement;

	let isTrackPlaying = false;
	let currentTrack: Track | null;
	let mqClient: MqttClient;
	let noSleep: NoSleep | null;

	const ONE_HOUR = 3600 * 1000;
	const ONE_MINUTE = 60 * 1000;

	function goFullscreen() {
		if (mainEl) mainEl.requestFullscreen({ navigationUI: 'hide' });
	}

	async function createTrackQrCode(track: Track) {
		console.log('Creating QR code');

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
		const track: Track = {
			id: '3IvTwPCCjfZczCN2k4qPiH',
			albumImages: ['/steely-dan-cover.jpg'],
			artists: ['Steely Dan', 'Donald Fagen', 'Walter Becker'],
			name: 'Dirty Work',
			url: 'https://open.spotify.com/track/3IvTwPCCjfZczCN2k4qPiH'
		};
		setCurrentTrack(track);
		setBackgroundColor(track);
		isTrackPlaying = true;
	}

	function setCurrentTrack(track: Track) {
		currentTrack = track;
	}

	async function setBackgroundColor(track: Track) {
		if (!mainEl) return;

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
				if (trackId !== currentTrack?.id) {
					const track = await getTrack(trackId);
					setCurrentTrack(track);
					setBackgroundColor(track);
				}
				isTrackPlaying = true;
				break;
			case 'paused':
			case 'stopped':
				isTrackPlaying = false;
				break;
		}
	}

	onMount(async () => {
		mqClient = setupMqtt(onMqttMessageHandler);
		noSleep = new NoSleep();

		if (devMode) setTestTrack();
	});

	afterUpdate(() => {
		if (currentTrack) createTrackQrCode(currentTrack);
	});
</script>

<main
	class="p-10 h-screen transition-all duration-500 {isTrackPlaying
		? 'opacity-100'
		: 'opacity-0'}"
	bind:this={mainEl}
>
	<div
		on:click={() => {
			goFullscreen();
			if (noSleep && !noSleep.isEnabled) noSleep.enable();
		}}
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
				<div class="text-neutral-300 text-2xl font-medium">
					{currentTrack.artists.join(', ')}
				</div>
			</div>

			<canvas
				class="absolute bottom-0 right-0 m-10 rounded-lg"
				bind:this={canvasEl}
			/>
		{/if}
	</div>
</main>

{#if devMode}
	<div class="absolute bottom-0 left-0 m-10">
		<Button
			on:click={() => publishTestPlayerEvent(mqClient)}
			label="Publish Test Message"
		/>
		<Button on:click={setTestTrack} label="Simulate Test Track Played" />
		<Button
			on:click={() => {
				isTrackPlaying = false;
			}}
			label="Simulate Track Stopped"
		/>
	</div>
{/if}
