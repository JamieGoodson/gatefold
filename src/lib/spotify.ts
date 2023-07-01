export interface Track {
	id: string;
	albumImages: string[];
	artists: string[];
	name: string;
}

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const spotifyApiUrl = 'https://api.spotify.com/v1';

export async function getAccessToken(): Promise<string> {
	// https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow

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

	return (resJson as any).access_token as string;
}

export async function getTrack(id: string, token: string): Promise<Track> {
	// https://developer.spotify.com/documentation/web-api/reference/get-track

	console.log(`Spotify: Getting track by track ID ${id}`);

	const res = await fetch(`${spotifyApiUrl}/tracks/${id}`, {
		headers: { Authorization: `Bearer ${token}` }
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
		name: track.name
	};
}
