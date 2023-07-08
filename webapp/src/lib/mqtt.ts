import type { MqttClient } from 'mqtt';
import mqtt from 'mqtt/dist/mqtt';

type PlayerEvent =
	| 'started'
	| 'stopped'
	| 'playing'
	| 'changed'
	| 'paused'
	| 'volume_set'
	| 'preloading';

export interface PlayerEventMessage {
	playerEvent: PlayerEvent;
	oldTrackId: string;
	trackId: string;
}

const topic = import.meta.env.VITE_MQTT_TOPIC;
const brokerUrl = import.meta.env.VITE_MQTT_BROKER_URL;

export function setupMqtt(
	onMessageHandler: (message: string) => void
): MqttClient {
	console.log(`Connecting to MQTT broker at ${brokerUrl}`);
	const client = mqtt.connect(brokerUrl);

	client.on('connect', () => {
		console.log('MQTT: Connected');
		client.subscribe(topic);
	});

	client.on('disconnect', () => {
		console.log('MQTT: Disconnected');
	});

	client.on('offline', function () {
		console.log('MQTT: Offline');
	});

	client.on('reconnect', function () {
		console.log('MQTT: Reconnecting...');
	});

	client.on('error', (error) => {
		console.log('MQTT: Error');
		console.error(error);
	});

	client.on('message', async (receivedTopic, receivedMessage) => {
		console.log('MQTT: Message received');

		const message = receivedMessage.toString();
		if (!message || message == '{}') {
			console.warn('MQTT: Empty message. Ignoring...');
			return;
		}

		console.log(`MQTT: ${message}`);

		onMessageHandler(message);
	});

	return client;
}

export function publishTestPlayerEvent(client: MqttClient) {
	console.log(`Publishing test message to topic: ${topic}`);
	const testPlayerEvent: PlayerEventMessage = {
		playerEvent: 'playing',
		trackId: '2sCaihW0VlDKecbUgMSzRY',
		oldTrackId: ''
	};

	client.publish(topic, JSON.stringify(testPlayerEvent));
}
