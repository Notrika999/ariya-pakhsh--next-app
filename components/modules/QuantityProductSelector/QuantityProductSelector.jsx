const QuantitySelector = ({ value, onChange, min = 1, max }) => {
  const increment = () => {
    onChange((prev) => {
      if (max !== undefined && prev >= max) return prev;
      return prev + 1;
    });
  };

  const decrement = () => {
    onChange((prev) => {
      if (prev <= min) return prev;
      return prev - 1;
    });
  };

  return (
    <div className="inline-flex items-center space-x-2 border border-gray-200 dark:border-zinc-700 rounded-lg px-1 bg-white dark:bg-zinc-800 shadow">
      <button
        type="button"
        onClick={increment}
        className="size-10 rounded-full flex items-center justify-center dark:text-white"
      >
        +
      </button>

      <span className="px-5 text-lg dark:text-white">{value}</span>

      <button
        type="button"
        onClick={decrement}
        className="size-10 rounded-full flex items-center justify-center dark:text-white"
      >
        −
      </button>
    </div>
  );
};

export default QuantitySelector;
