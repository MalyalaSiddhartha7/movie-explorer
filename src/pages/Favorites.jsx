
import { Heart } from "lucide-react";
import MovieGrid from "../components/MovieGrid";
import { useFavorites } from "../context/FavoritesContext";
import { Link } from "react-router-dom";

function Favorites() {
  const { favorites } = useFavorites();

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-5 sm:py-10">
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-2xl font-bold sm:text-3xl">
          <Heart className="text-red-500" />
          My Favourites
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          {favorites.length} saved{" "}
          {favorites.length === 1 ? "movie" : "movies"}
        </p>
      </div>

      {favorites.length > 0 ? (
        <MovieGrid movies={favorites} />
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-12 text-center sm:py-16">
          <Heart
            size={48}
            className="mx-auto mb-4 text-gray-500"
          />

          <h2 className="text-xl font-bold">
            No favourites yet
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-400">
            Browse movies and tap the heart icon to save
            your favourite movies here.
          </p>

          <Link
            to="/"
            className="mt-6 inline-block rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Explore Movies
          </Link>
        </div>
      )}
    </main>
  );
}

export default Favorites;
