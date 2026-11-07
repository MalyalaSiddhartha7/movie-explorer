function Loader({ text = "Loading movies..." }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-gray-400">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>

      <p>{text}</p>
    </div>
  );
}

export default Loader;