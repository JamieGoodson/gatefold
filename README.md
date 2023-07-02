## Browser App

The browser app uses a pub/sub model to listen for messages from the Raspberry Pi.
It can be served either from the Raspberry Pi itself or anywhere.

### Prerequisites

- Copy `.env.example` to `.env` and fill in the values. The MQTT values should match those in the raspotify script.
- Run `npm install`

### Dev

- Run `npm run dev`

### Production

- Run `npm run build`
- Serve preview via `npm run preview`

## Raspotify Script

A node script that runs whenever the raspotify (librespot) event hook fires (eg when the raspotify player changed songs).
This sends an event to the browser app to let it know that something happened.

- cd `raspotify/`
- Run `npm install`
- Configure the `topic` and `brokerUrl` in `main.js`

Add this to your raspotify config file:

```
OPTIONS="--onevent 'node ~/path/to/gatefold/raspberrypi/main.js'"
```

### Dev

- Run `npm run dev` to publish a test event

## Useful links

- https://github.com/dtcooper/raspotify/issues/171#issuecomment-507423901
- https://github.com/librespot-org/librespot/blob/aa880f8888226a8e5fc6e1e54dfb7cf58176ac95/src/player_event_handler.rs
