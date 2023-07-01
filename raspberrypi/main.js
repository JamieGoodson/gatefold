var mqtt = require('mqtt');
var client = mqtt.connect('ws://broker.emqx.io:8083/mqtt');
var devMode = true;

client.on('connect', function () {
	console.log('MQTT: connect');

	var message;
	if (devMode) {
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
	client.end();
});
