var mqtt = require('mqtt');

var topic = '27b/librespot/playerEvent';
var brokerUrl = 'ws://broker.emqx.io:8083/mqtt';

var client = mqtt.connect(brokerUrl);

client.on('connect', function () {
	console.log('MQTT: connect');

	var message;
	if (process.env.DEV_MODE) {
		message = {
			playerEvent: 'start',
			trackId: '2sCaihW0VlDKecbUgMSzRY'
		};
	} else {
		message = {
			playerEvent: process.env.PLAYER_EVENT,
			oldTrackId: process.env.OLD_TRACK_ID,
			trackId: process.env.TRACK_ID
		};
	}

	client.publish(topic, JSON.stringify(message));
	console.log('MQTT: Published');
	console.log(message);
	client.end();
});
