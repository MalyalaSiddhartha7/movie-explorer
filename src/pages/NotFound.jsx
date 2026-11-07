
import { Link } from "react-router-dom";
import { Film, Home } from "lucide-react";

function NotFound() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-16 text-center">

      <Film
        size={64}
        className="mb-5 text-red-500"
      />

      <h1 className="text-5xl font-black sm:text-7xl">
        404
      </h1>

      <h2 className="mt-3 text-xl font-bold sm:text-2xl">
        Page Not Found
      </h2>

      <p className="mt-3 max-w-md text-sm leading-6 text-gray-400 sm:text-base">
        Sorry, the page you are looking for does not exist.
        It may have been moved or the URL may be incorrect.
      </p>

      <Link
        to="/"
        className="mt-7 inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
      >
        <Home size={18} />
        Return Home
      </Link>

    </main>
  );
}

export default NotFound;
