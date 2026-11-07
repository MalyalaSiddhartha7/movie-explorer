
import { useEffect, useState } from "react";
import { ArrowLeft, Heart, ExternalLink } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import {
  fetchTMDB,
  IMAGE_BASE_URL,
} from "../services/tmdb";

import { useFavorites } from "../context/FavoritesContext";
import Loader from "../components/Loader";

function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const controller = new AbortController();

    async function loadDetails() {
      try {
        setLoading(true);
        setError("");

        const [movieData, creditsData, videoData] =
          await Promise.all([
            fetchTMDB(`/movie/${id}`, controller.signal),
            fetchTMDB(`/movie/${id}/credits`, controller.signal),
            fetchTMDB(`/movie/${id}/videos`, controller.signal),
          ]);

        setMovie(movieData);
        setCast(creditsData.cast || []);
        setVideos(videoData.results || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadDetails();

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return <Loader text="Loading movie details..." />;
  }

  if (error || !movie) {
    return (
      <main className="min-h-screen px-4 py-10 text-red-300">
        {error || "Movie not found."}
      </main>
    );
  }

  const trailer =
    videos.find(
      (video) =>
        video.site === "YouTube" &&
        video.type === "Trailer" &&
        video.official
    ) ||
    videos.find(
      (video) =>
        video.site === "YouTube" &&
        video.type === "Trailer"
    ) ||
    videos.find((video) => video.site === "YouTube");

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl overflow-hidden px-4 py-6 sm:px-5 sm:py-8">

      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-300 transition hover:text-white sm:text-base"
      >
        <ArrowLeft size={18} />
        Back home
      </Link>

      <section className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-[260px_minmax(0,1fr)] md:gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">

        <div className="mx-auto w-full max-w-[280px] md:mx-0 md:max-w-none">
          {movie.poster_path ? (
            <img
              src={`${IMAGE_BASE_URL}${movie.poster_path}`}
              alt={`${movie.title} poster`}
              className="aspect-[2/3] w-full rounded-2xl object-cover shadow-xl"
            />
          ) : (
            <div className="grid aspect-[2/3] place-items-center rounded-2xl bg-white/10 text-gray-400">
              No poster available
            </div>
          )}
        </div>

        <div className="min-w-0">

          <div className="flex items-start justify-between gap-3">
            <h1 className="min-w-0 break-words text-2xl font-black sm:text-3xl lg:text-4xl">
              {movie.title}
            </h1>

            <button
              type="button"
              onClick={() => toggleFavorite(movie)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-700"
              aria-label="Toggle favourite"
              aria-pressed={isFavorite(movie.id)}
            >
              <Heart
                size={21}
                fill={isFavorite(movie.id) ? "white" : "none"}
              />
            </button>
          </div>

          <p className="mt-3 break-words text-sm text-gray-400 sm:text-base">
            {movie.release_date || "Release date unavailable"}
            {" · "}★ {Number(movie.vote_average || 0).toFixed(1)}
            {" · "}{movie.runtime || "?"} min
          </p>

          <h2 className="mt-7 text-xl font-bold">
            Overview
          </h2>

          <p className="mt-2 break-words text-sm leading-7 text-gray-300 sm:text-base">
            {movie.overview || "No overview available."}
          </p>

          <h2 className="mt-7 text-xl font-bold">
            Cast
          </h2>

          {cast.length > 0 ? (
            <div className="mt-4 flex min-w-0 gap-4 overflow-x-auto pb-4">
              {cast.slice(0, 12).map((person) => (
                <div
                  key={person.credit_id}
                  className="w-24 shrink-0 sm:w-28"
                >
                  <div className="aspect-[3/4] overflow-hidden rounded-lg bg-white/10">
                    {person.profile_path ? (
                      <img
                        src={`${IMAGE_BASE_URL}${person.profile_path}`}
                        alt={person.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-center text-xs text-gray-500">
                        No photo
                      </div>
                    )}
                  </div>

                  <p className="mt-2 line-clamp-2 text-sm font-semibold">
                    {person.name}
                  </p>

                  <p className="line-clamp-2 text-xs text-gray-400">
                    {person.character}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-gray-400">
              Cast information unavailable.
            </p>
          )}

        </div>
      </section>

      <section className="mt-10 min-w-0">
        <h2 className="mb-4 text-xl font-bold sm:text-2xl">
          Trailer
        </h2>

        {trailer ? (
          <>
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
              <iframe
                key={trailer.key}
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${trailer.key}?playsinline=1&rel=0`}
                title={`${movie.title} movie trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            <a
              href={`https://www.youtube.com/watch?v=${trailer.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm text-red-400 transition hover:text-red-300"
            >
              Watch on YouTube
              <ExternalLink size={16} />
            </a>
          </>
        ) : (
          <p className="rounded-xl bg-white/5 p-5 text-sm text-gray-400">
            No trailer available for this movie.
          </p>
        )}
      </section>

    </main>
  );
}

export default MovieDetails;
