
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchTMDB } from "../services/tmdb";
import MovieRow from "../components/MovieRow";
import MovieGrid from "../components/MovieGrid";
import Loader from "../components/Loader";

function Home() {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [loadMoreError, setLoadMoreError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const observerRef = useRef(null);
  const loadingMoreRef = useRef(false);

  // Load initial movies
  useEffect(() => {
    const controller = new AbortController();

    async function loadMovies() {
      try {
        setLoading(true);
        setError("");

        const [trendingData, popularData] = await Promise.all([
          fetchTMDB("/trending/movie/week", controller.signal),
          fetchTMDB("/movie/popular?page=1", controller.signal),
        ]);

        setTrending(trendingData.results || []);
        setPopular(popularData.results || []);
        setTotalPages(popularData.total_pages || 1);
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

    loadMovies();

    return () => controller.abort();
  }, []);

  // Load the next page of popular movies
  const loadMoreMovies = useCallback(async () => {
    if (loadingMoreRef.current || page >= totalPages) {
      return;
    }

    loadingMoreRef.current = true;
    setLoadingMore(true);
    setLoadMoreError("");

    const nextPage = page + 1;

    try {
      const data = await fetchTMDB(
        `/movie/popular?page=${nextPage}`
      );

      setPopular((previousMovies) => {
        const existingIds = new Set(
          previousMovies.map((movie) => movie.id)
        );

        const newMovies = (data.results || []).filter(
          (movie) => !existingIds.has(movie.id)
        );

        return [...previousMovies, ...newMovies];
      });

      setPage(nextPage);
      setTotalPages(data.total_pages || totalPages);
    } catch (err) {
      setLoadMoreError(err.message);
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [page, totalPages]);

  // Keep the latest load function available to the observer
  const loadMoreRef = useRef(loadMoreMovies);
  loadMoreRef.current = loadMoreMovies;

  // Automatically load when the user reaches the bottom
  useEffect(() => {
    const target = observerRef.current;

    if (!target || loading || page >= totalPages) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreRef.current();
        }
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0,
      }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [loading, page, totalPages]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-5 sm:py-8">
      <section className="mb-10 rounded-2xl bg-gradient-to-r from-red-950 to-[#242424] p-6 sm:p-12">
        <p className="mb-2 font-semibold uppercase tracking-widest text-red-400">
          Discover your next favourite
        </p>

        <h1 className="text-3xl font-black sm:text-5xl">
          Movies worth staying in for.
        </h1>

        <p className="mt-3 text-gray-300">
          Explore trending films and popular releases.
        </p>
      </section>

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-300">{error}</p>
      ) : (
        <>
          <MovieRow
            title="Trending This Week"
            movies={trending}
          />

          <section className="mt-12">
            <h2 className="mb-5 text-2xl font-bold">
              Popular Movies
            </h2>

            <MovieGrid movies={popular} />

            {loadMoreError && (
              <p className="my-4 text-center text-red-300">
                {loadMoreError}
              </p>
            )}

            {page < totalPages ? (
              <div className="py-8 text-center">
                <button
                  type="button"
                  onClick={loadMoreMovies}
                  disabled={loadingMore}
                  className="rounded-full bg-red-600 px-7 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loadingMore
                    ? "Loading movies..."
                    : "Load More Movies"}
                </button>
              </div>
            ) : (
              <p className="py-8 text-center text-gray-400">
                You have reached the end of popular movies.
              </p>
            )}

            <div
              ref={observerRef}
              className="h-5"
              aria-hidden="true"
            />
          </section>
        </>
      )}
    </main>
  );
}

export default Home;
