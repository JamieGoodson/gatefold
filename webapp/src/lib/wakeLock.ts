let wakeLock: WakeLockSentinel | null = null;

/**
 * Prevents device screen from sleeping
 * https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API
 * */
export async function setupWakeLock() {
	if (!('wakeLock' in navigator)) {
		console.error(
			'Screen wakeLock not supported on this device/browser. Note: This feature only works in secure contexts (https)'
		);
		return;
	}

	await requestWakeLock();

	document.addEventListener('visibilitychange', async () => {
		if (wakeLock !== null && document.visibilityState === 'visible') {
			requestWakeLock();
		}
	});
}

async function requestWakeLock() {
	try {
		console.log('WakeLock: Requesting');
		wakeLock = await navigator.wakeLock.request('screen');
		console.log('WakeLock: Aquired');

		wakeLock.addEventListener('release', () => {
			console.log('WakeLock: Released');
		});
	} catch (error) {
		// The Wake Lock request has failed - usually system related, such as battery.
		console.error('WakeLock: Could not get wake lock');
		console.error(error);
	}
}
