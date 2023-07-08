# Gatefold - A Display For Raspotify

<img src="https://github.com/JamieGoodson/gatefold/assets/4729966/74e448fe-f04d-4e6f-b665-45d1faf62c67" width="600">

Display the currently playing Spotify track. Made for the Raspberry Pi.

## Features

- ✅ Displays currently playing track
- ✅ Suitable for communal areas where lots of different people connect to Raspotify daily
- ✅ QR code takes you directly to the song on the Spotify app
- ✅ No login required

## Why Gatefold?

Gatefold is for individuals, organizations, or households with communal areas. Other solutions
like Gatefold exist, but require each user to authorize with their Spotify account.
With Gatefold it doesn't matter who's connected - **no login required!**

---

# Installation

## Part 1 - Web App Setup

### 1. Generate Spotify client credentials

Login to the [Spotify Dashboard](https://developer.spotify.com/dashboard) and hit 'Create app'. Call the app 'Gatefold', give it some description, and set the 'Redirect URI' to `example.com` (we don't need this but it's a required field).

Leave the other settings blank. Click 'Settings' on the app's page and make a note of the 'Client ID' and 'Client secret'.

### 2. Fork this repo

Click the 'Fork' button at the top of this page to copy this repo to your account.

### 3. Create a site on Netlify

Create an account on [Netlify](https://www.netlify.com/) if you don't already have one.

Login, go to the 'Team overview' tab, select 'Add new site' > 'Import an existing project' > 'Deploy with GitHub'. If this is your first Netlify site, it'll ask you to authorise your GitHub account. Once authorised, select your forked Gatefold project.

Set the 'Base directory' to `webapp`, leave all other settings as whatever Netlify sets.

Under 'Environment variables' create a new variable for each of the following:

- `VITE_MQTT_BROKER_URL`: `wss://broker.emqx.io:8084/mqtt`
- `VITE_MQTT_TOPIC`: `[Your GitHub username]/raspotify/playerEvent`
- `VITE_SPOTIFY_CLIENT_ID`: `[Your Spotify Client ID]`
- `VITE_SPOTIFY_CLIENT_SECRET`: `[Your Spotify Client Secret]`

Replace the values in the square brackets (incl. the brackets) with your values.

Hit the Deploy button.

### 4. View Gatefold

On your tablet or other device, navigate to the Netlify URL of your site (it'll be a black screen for now). Tap anywhere on the screen once to make it go fullscreen (this will also prevent the device from sleeping). Bookmark this URL if you wish.

Done!

## Part 2 - Raspotify Setup

Install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) on your Raspberry Pi.

Clone this repo onto your Raspberry Pi (eg in ~/). Then run:

```
cd gatefold/raspotify
./setup.sh
sudo systemctl daemon-reload && sudo systemctl restart raspotify
```

Follow the setup instructions.

Done! Raspotify will now send player events to the Netlify site we created earlier.

# Note

By default, a free public service ([broker.emqx.io](broker.emqx.io)) is used to
communicate between the Raspberry Pi and your Gatefold site. This means the
Spotify track IDs played on your Raspotify are, in theory, publicy visible.
If you'd prefer to host your own MQTT service, you may do so.
