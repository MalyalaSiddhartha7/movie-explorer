
import { useEffect, useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import useDebounce from "../hooks/useDebounce";
import { fetchTMDB } from "../services/tmdb";
import MovieGrid from "../components/MovieGrid";
import Loader from "../components/Loader";

function Search() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const debouncedQuery = useDebounce(query.trim(), 500);

  useEffect(() => {
    if (!debouncedQuery) {
      setMovies([]);
      setError("");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function searchMovies() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchTMDB(
          `/search/movie?query=${encodeURIComponent(
            debouncedQuery
          )}&include_adult=false`,
          controller.signal
        );

        setMovies(data.results || []);
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

    searchMovies();

    return () => controller.abort();
  }, [debouncedQuery]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-5 sm:py-10">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">
        Search Movies
      </h1>

      <label className="mb-8 flex w-full max-w-2xl items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-red-500">
        <SearchIcon
          size={21}
          className="shrink-0 text-gray-400"
        />

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by movie title..."
          aria-label="Search movies by title"
          className="min-w-0 w-full bg-transparent text-base text-white outline-none placeholder:text-gray-500"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="shrink-0 rounded-full p-1 text-gray-400 hover:text-white"
          >
            <X size={19} />
          </button>
        )}
      </label>

      {loading && (
        <Loader text="Searching movies..." />
      )}

      {error && (
        <p className="mb-5 text-red-300">
          {error}
        </p>
      )}

      {!loading &&
        debouncedQuery &&
        !error &&
        movies.length === 0 && (
          <p className="mb-5 text-center text-gray-400">
            No movies found. Try another title.
          </p>
        )}

      {!debouncedQuery && (
        <p className="mb-5 text-sm text-gray-400">
          Start typing. Results appear after you stop typing.
        </p>
      )}

      <MovieGrid movies={movies} />
    </main>
  );
}

export default Search;
