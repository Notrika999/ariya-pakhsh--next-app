export default function Loading() {
  return (
    <div className="grid grid-cols-12 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="col-span-12 sm:col-span-6 md:col-span-3 h-64 bg-gray-200 animate-pulse rounded-xl"
        />
      ))}
    </div>
  );
}