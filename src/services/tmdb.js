const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const BASE_URL = "https://api.themoviedb.org/3";

export const IMAGE_BASE_URL =
  "https://image.tmdb.org/t/p/w500";

export const BACKDROP_BASE_URL =
  "https://image.tmdb.org/t/p/original";

export async function fetchTMDB(endpoint, signal) {
  if (!API_KEY) {
    throw new Error(
      "TMDB API key is missing. Please check your .env file."
    );
  }

  const separator = endpoint.includes("?") ? "&" : "?";

  const response = await fetch(
    `${BASE_URL}${endpoint}${separator}api_key=${API_KEY}`,
    { signal }
  );

  if (!response.ok) {
    throw new Error(
      `TMDB request failed: ${response.status}`
    );
  }

  return response.json();
}