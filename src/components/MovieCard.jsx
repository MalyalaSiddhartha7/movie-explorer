
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { IMAGE_BASE_URL } from "../services/tmdb";
import { useFavorites } from "../context/FavoritesContext";

function MovieCard({ movie }) {
  const { toggleFavorite, isFavorite } = useFavorites();

  const liked = isFavorite(movie.id);

  return (
    <article className="group relative min-w-0 w-full">
      <Link
        to={`/movie/${movie.id}`}
        className="block"
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-white/5">
          {movie.poster_path ? (
            <img
              src={`${IMAGE_BASE_URL}${movie.poster_path}`}
              alt={`${movie.title} poster`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full place-items-center text-center text-sm text-gray-500">
              No poster available
            </div>
          )}
        </div>

        <h3 className="mt-2 line-clamp-2 min-h-10 text-sm font-semibold leading-5 sm:text-base">
          {movie.title}
        </h3>

        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
          ★ {Number(movie.vote_average || 0).toFixed(1)}
        </p>
      </Link>

      <button
        type="button"
        onClick={() => toggleFavorite(movie)}
        aria-label={
          liked
            ? `Remove ${movie.title} from favourites`
            : `Add ${movie.title} to favourites`
        }
        aria-pressed={liked}
        className={`absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-colors ${
          liked
            ? "bg-red-600 text-white"
            : "bg-black/75 text-white hover:bg-red-600"
        }`}
      >
        <Heart
          size={19}
          fill={liked ? "white" : "none"}
        />
      </button>
    </article>
  );
}

export default MovieCard;
