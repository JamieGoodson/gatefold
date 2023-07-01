export interface Track {
  id: string;
  albumImages: string[];
  artists: string[];
  name: string;
}

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

async function getAccessToken() {
  // TODO: https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow
}

async function getTrack(id: string) {
  // TODO: https://developer.spotify.com/documentation/web-api/reference/get-track
}