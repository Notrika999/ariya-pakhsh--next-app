function Block({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-gray-100 dark:bg-zinc-800 ${className}`} />
  );
}

export default function MagazineArticleSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 pb-16 md:px-6 md:py-8 md:pb-16 lg:px-8"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Block className="h-4 w-16" />
        <Block className="h-3 w-3 rounded-full" />
        <Block className="h-4 w-14" />
        <Block className="h-3 w-3 rounded-full" />
        <Block className="h-4 w-24" />
        <Block className="h-3 w-3 rounded-full" />
        <Block className="h-4 w-40" />
      </div>

      <header className="space-y-4 rounded-xl bg-white p-5 md:p-8 dark:bg-custom-dark">
        <div className="flex flex-wrap items-center gap-2">
          <Block className="h-5 w-16" />
          <Block className="h-5 w-20" />
        </div>
        <Block className="h-9 w-3/4 md:h-10" />
        <Block className="h-9 w-1/2 md:h-10" />
        <div className="space-y-2">
          <Block className="h-4 w-full" />
          <Block className="h-4 w-11/12" />
          <Block className="h-4 w-4/5" />
        </div>
        <div className="flex items-center gap-3">
          <Block className="size-7 rounded-full" />
          <Block className="h-3 w-24" />
          <Block className="h-3 w-20" />
          <Block className="h-3 w-16" />
        </div>
      </header>

      <Block className="aspect-video w-full rounded-xl" />

      <div className="grid gap-8 lg:grid-cols-12">
        <aside className="hidden lg:col-span-4 lg:block">
          <div className="space-y-3 rounded-xl bg-white p-5 dark:bg-custom-dark">
            <Block className="mb-4 h-5 w-28" />
            <Block className="h-4 w-full" />
            <Block className="h-4 w-5/6" />
            <Block className="h-4 w-4/5" />
            <Block className="h-4 w-11/12" />
            <Block className="h-4 w-3/4" />
            <Block className="h-4 w-5/6" />
          </div>
        </aside>

        <div className="min-w-0 space-y-5 rounded-xl bg-white p-5 md:p-8 lg:col-span-8 dark:bg-custom-dark">
          <div className="mb-6 space-y-3 lg:hidden">
            <Block className="h-5 w-28" />
            <Block className="h-4 w-full" />
            <Block className="h-4 w-4/5" />
            <Block className="h-4 w-5/6" />
          </div>
          <Block className="h-7 w-2/3" />
          <div className="space-y-2">
            <Block className="h-4 w-full" />
            <Block className="h-4 w-full" />
            <Block className="h-4 w-11/12" />
            <Block className="h-4 w-4/5" />
          </div>
          <Block className="aspect-[16/9] w-full" />
          <div className="space-y-2">
            <Block className="h-4 w-full" />
            <Block className="h-4 w-10/12" />
            <Block className="h-4 w-full" />
            <Block className="h-4 w-3/4" />
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            <Block className="h-8 w-16" />
            <Block className="h-8 w-20" />
            <Block className="h-8 w-14" />
          </div>
        </div>
      </div>

      <section>
        <Block className="mb-4 h-6 w-36" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <Block className="h-40 sm:h-48" />
          <Block className="h-40 sm:h-48" />
          <Block className="h-40 sm:h-48" />
          <Block className="hidden h-48 sm:block" />
        </div>
      </section>

      <section>
        <Block className="mb-4 h-6 w-28" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Block className="aspect-video" />
          <Block className="aspect-video" />
          <Block className="aspect-video" />
        </div>
      </section>

      <div className="rounded-xl bg-white px-5 py-8 md:px-8 dark:bg-custom-dark">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3">
          <Block className="h-7 w-64" />
          <Block className="h-4 w-80 max-w-full" />
          <Block className="mt-2 h-11 w-full max-w-md" />
        </div>
      </div>
    </div>
  );
}
