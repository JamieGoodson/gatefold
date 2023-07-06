# Gatefold - A Display For Raspotify

<img src="https://github.com/JamieGoodson/gatefold/assets/4729966/74e448fe-f04d-4e6f-b665-45d1faf62c67" width="600">

## Prerequisites

Node >= v18.x (currently LTS) must be installed system-wide. To check your node version,
run both `node -v` **and** `sudo node -v` (to confirm the same version for all users).

If you don't have it installed, you can run:

```
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

## Part A - The Web App

The web app is what displays the track info. It uses a pub/sub model to listen for messages
from the Raspberry Pi/Raspotify. It can be served either from the Raspberry Pi itself
or anywhere.

### Prerequisites

- From repo root: `cd webapp/`
- Copy `.env.example` to `.env` and fill in the values. The MQTT values should match those in the Raspotify script.
- Run `npm install`

### Dev

- Run `npm run dev`

### Production

- Run `npm run build`
- Run `npm run serve`

The server should now be running! 🎉

Direct your device's browser to your Raspberry Pi's IP and port `8080`
(or wherever you're hosting the app) to view Gatefold 🙂

For example `http://192.168.1.143:8080/`

### Run as a service (recommended)

To keep the app running forever, it's best to run Gatefold as a service on the Raspberry Pi. To do this:

- Run `npm run build`
- Edit the `ExecStart` path to point to the right place (ie the full path to this directory)
- Run `cp gatefold.service /lib/systemd/system/`
- Run `sudo systemctl start gatefold`

This will start the Gatefold service and run in the background. It'll also start automatically on system startup.

Direct your device's browser to your Raspberry Pi's IP and port `8080`
(or wherever you're hosting the app) to view Gatefold 🙂

For example `http://192.168.1.143:8080/`

## Part B - The Raspotify Script

A node script that lives on your Raspberry Pi and runs whenever the Raspotify (Librespot) event hook fires (eg when the Raspotify player changed songs).
This sends an event to the browser app to let it know that something happened.

### Part 1 - The event script

- Ensure Node is installed system-wide on your Raspberry Pi (nvm won't do)
- From repo root: `cd raspotify/`
- Run `npm install`
- Configure the `topic` and `brokerUrl` in `gatefold.js`

Add this to your Raspotify config file (`/etc/raspotify/conf`):

```
LIBRESPOT_ONEVENT="node /home/pi/path/to/gatefold/raspotify/gatefold.js"
```

### Part 2 - The Raspotify service

At some point the Raspotify service was updated to only run in a high security state with very few permissions.
This prevents our script from being able to run (see [official discussion thread](https://github.com/dtcooper/raspotify/issues/500) on this issue). To fix this, we can overwrite the default
Raspotify service with our own one that has more freedom and runs under the `pi` user.

Caution: Run at your own risk.

- Backup the existing service: `sudo mv /lib/systemd/system/raspotify.service.backup`
- Copy our service in place of the original one: `sudo cp raspotify.service  /lib/systemd/system/`
- Reload systemd files and restart the Raspotify service: `sudo systemctl daemon-reload && sudo systemctl restart raspotify`

Raspotify should now be sending out MQTT messages whenever you pause/play (etc) a track.
You can confirm this by following the Raspotify logs in realtime:

`sudo journalctl --follow -u raspotify`

You should see it publish a MQTT message on each event. That's it! Your browser
app should respond to these events.

### Dev

- Run `npm run dev` to publish a test event.

If the browser app is configured and running correctly, you should see it display a track.
If not, try opening the browser console and check if it's receiving any
messages/showing any errors.

## Useful links

- https://github.com/dtcooper/raspotify/issues/171#issuecomment-507423901
- https://github.com/librespot-org/librespot/blob/aa880f8888226a8e5fc6e1e54dfb7cf58176ac95/src/player_event_handler.rs
