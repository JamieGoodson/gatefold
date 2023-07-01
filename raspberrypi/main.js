var mqtt = require('mqtt');
var client = mqtt.connect('ws://broker.emqx.io:8083/mqtt');

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

	client.publish('librespot/playerEvent', JSON.stringify(message));
	console.log('MQTT: published');
	console.log(message);
	client.end();
});
