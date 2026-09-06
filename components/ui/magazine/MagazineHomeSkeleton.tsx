import { MAGAZINE_SECTION_SHELL } from "@/components/ui/magazine/sections/MagazineSection";

function Block({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-gray-100 dark:bg-zinc-800 ${className}`} />;
}

export default function MagazineHomeSkeleton() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 md:gap-5 md:px-6 md:py-8 lg:px-8">
      <div className="h-4 w-40 rounded bg-gray-100 dark:bg-zinc-800" />
      <section className={MAGAZINE_SECTION_SHELL}>
        <div className="mb-4 h-7 w-40 rounded bg-gray-100 dark:bg-zinc-800" />
        <div className="grid gap-3 lg:grid-cols-5">
          <Block className="min-h-72 lg:col-span-3 lg:min-h-[28rem]" />
          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-2">
            <Block className="min-h-36" />
            <Block className="min-h-36" />
            <Block className="min-h-36" />
            <Block className="min-h-36" />
          </div>
        </div>
      </section>
      <section className={MAGAZINE_SECTION_SHELL}>
        <div className="mb-4 h-7 w-32 rounded bg-gray-100 dark:bg-zinc-800" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Block className="aspect-video" />
          <Block className="aspect-video" />
          <Block className="aspect-video" />
        </div>
      </section>
    </div>
  );
}
