const QuantitySelector = ({
  value,
  onChange,
  min = 1,
  max,
  loading = false,
  disabled = false,
}) => {
  const increment = () => {
    if (loading || disabled) return;
    onChange((prev) => {
      if (max !== undefined && prev >= max) return prev;
      return prev + 1;
    });
  };

  const decrement = () => {
    if (loading || disabled) return;
    onChange((prev) => {
      if (prev <= min) return prev;
      return prev - 1;
    });
  };

  return (
    <div className="inline-flex items-center space-x-1 border border-gray-200 dark:border-zinc-700 rounded-lg px-1 bg-white dark:bg-zinc-800 shadow">
      <button
        type="button"
        onClick={increment}
        disabled={loading || disabled}
        className="size-10 rounded-full flex items-center justify-center dark:text-white disabled:cursor-wait disabled:opacity-60"
      >
        +
      </button>

      <span className="flex min-w-12 items-center justify-center px-3 text-lg dark:text-white">
        {loading ? (
          <i className="far fa-spinner-third animate-spin text-base" />
        ) : (
          value
        )}
      </span>

      <button
        type="button"
        onClick={decrement}
        disabled={loading || disabled}
        className="size-10 rounded-full flex items-center justify-center dark:text-white disabled:cursor-wait disabled:opacity-60"
      >
        −
      </button>
    </div>
  );
};

export default QuantitySelector;
