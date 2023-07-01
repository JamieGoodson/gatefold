## Browser App

The browser app uses a pub/sub model to listen for messages from the Raspberry Pi.

### Prerequisites

- Copy `.env.example` to `.env` and fill in the values.
- Run `npm install`

### Dev

- Run `npm run dev`

### Production

- Run `npm run build`
- Serve preview via `npm run preview`

## Raspberry Pi

- cd `raspberrypi/`
- Run `npm install`

Add this to your raspotify config file:

```
OPTIONS="--onevent 'node ~/path/to/gatefold/raspberrypi/main.js'"
```

### Dev

- Run `npm run dev` to publish a test message

## Useful links

- https://github.com/dtcooper/raspotify/issues/171#issuecomment-507423901
- https://github.com/librespot-org/librespot/blob/aa880f8888226a8e5fc6e1e54dfb7cf58176ac95/src/player_event_handler.rs
