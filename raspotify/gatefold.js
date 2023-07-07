import "dotenv/config";
import mqtt from "mqtt";

const topic = process.env.MQTT_TOPIC;
const brokerUrl = process.env.MQTT_BROKER_URL;
const isDev = process.env.IS_DEV === "true";

if (!topic || !brokerUrl) {
  console.log("Some required env variables are missing");
}

const client = mqtt.connect(brokerUrl);

client.on("connect", function () {
  console.log("MQTT: Connected");

  let message;
  if (isDev) {
    message = {
      playerEvent: "playing",
      trackId: "2sCaihW0VlDKecbUgMSzRY",
    };
  } else {
    message = {
      playerEvent: process.env.PLAYER_EVENT,
      oldTrackId: process.env.OLD_TRACK_ID,
      trackId: process.env.TRACK_ID,
    };
  }

  client.publish(topic, JSON.stringify(message));
  console.log("MQTT: Published");
  console.log(message);
  client.end();
});
