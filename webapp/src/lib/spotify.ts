export interface Track {
	id: string;
	albumImages: string[];
	artists: string[];
	name: string;
	url: string;
}

interface AccessToken {
	token: string;
	expiresAt: number;
}

const _accessToken: AccessToken | null = null;
const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const spotifyApiUrl = 'https://api.spotify.com/v1';

const ONE_MINUTE = 60 * 1000;

export async function getTrack(id: string): Promise<Track> {
	// https://developer.spotify.com/documentation/web-api/reference/get-track

	console.log(`Spotify: Getting track by track ID ${id}`);

	const accessToken = await getAccessToken();

	const res = await fetch(`${spotifyApiUrl}/tracks/${id}`, {
		headers: { Authorization: `Bearer ${accessToken.token}` }
	});

	const resJson = await res.json();

	if (!res.ok) {
		console.error(resJson);
		throw new Error('Spotify: Could not get track');
	}

	const track = resJson as SpotifyApi.TrackObjectFull;

	console.log('Spotify: Got track:');
	console.log(track);

	return {
		id,
		albumImages: track.album.images.map(({ url }) => url),
		artists: track.album.artists.map(({ name }) => name),
		name: track.name,
		url: track.external_urls.spotify
	};
}

async function getAccessToken(): Promise<AccessToken> {
	// https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow

	if (_accessToken && Date.now() < _accessToken.expiresAt) {
		console.log('Spotify: Using cached access token');
		return _accessToken;
	}

	console.log('Spotify: Refreshing access token');

	const res = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({ grant_type: 'client_credentials' }).toString()
	});

	const resJson = await res.json();

	if (!res.ok) {
		console.error(resJson);
		throw new Error('Spotify: Could not get access token');
	}

	const expiresAt = Date.now() + (resJson.expires_in * 1000 - ONE_MINUTE);
	return { token: resJson.access_token, expiresAt };
}
