"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

type Props = {
  page: number;
  totalPages: number;
};

export default function Pagination({
  page,
  totalPages,
}: Props) {
  const router = useRouter();

  const pathname = usePathname();

  const searchParams =
    useSearchParams();

  const goToPage = (
    target: number
  ) => {
    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    params.set(
      "page",
      target.toString()
    );

    router.push(
      `${pathname}?${params.toString()}`
    );
  };

  return (
    <div className="flex justify-center gap-2 mt-10">
      {Array.from(
        { length: totalPages },
        (_, i) => (
          <button
            key={i}
            onClick={() =>
              goToPage(i + 1)
            }
            className={`w-10 h-10 rounded-lg border ${
              page === i + 1
                ? "bg-primary text-white"
                : ""
            }`}
          >
            {i + 1}
          </button>
        )
      )}
    </div>
  );
}