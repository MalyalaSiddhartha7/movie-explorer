
import MovieCard from "./MovieCard";

function MovieRow({ title, movies }) {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className="mb-10 min-w-0">
      <h2 className="mb-4 text-xl font-bold sm:text-2xl">
        {title}
      </h2>

      <div className="flex gap-3 overflow-x-auto overflow-y-hidden pb-4 sm:gap-5">
        {movies.slice(0, 12).map((movie) => (
          <div
            key={movie.id}
            className="w-36 shrink-0 sm:w-44 md:w-48"
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default MovieRow;
