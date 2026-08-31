import GiftCardItem from "@/components/modules/GiftCardItem/GiftCardItem";
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import type { GiftCard } from "@/src/lib/types/userpanel/GiftCard";
import { GiftCardsGridSkeleton } from "../skeletons/UserProfileSkeletons";

interface MyGiftCardsProps {
  activeCards: GiftCard[];
  usedCards: GiftCard[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onDetails?: (id: string) => void;
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
      {message}
    </div>
  );
}

export default function MyGiftCards({
  activeCards,
  usedCards,
  loading = false,
  error = null,
  onRetry,
  onDetails,
}: MyGiftCardsProps) {
  return (
    <div id="my-gift-cards" className="tab-content space-y-2">
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>{error}</span>
            {onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
              >
                تلاش مجدد
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl bg-white px-3 py-2 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
        <TitleAfter title="کارت‌های هدیه فعال" tag={false} />

        {loading ? (
          <GiftCardsGridSkeleton />
        ) : activeCards.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeCards.map((card) => (
              <GiftCardItem key={card.id} card={card} onDetails={onDetails} />
            ))}
          </div>
        ) : (
          <EmptyState message="کارت هدیه فعالی برای نمایش وجود ندارد." />
        )}
      </div>

      <div className="rounded-2xl bg-white px-3 py-2 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
        <TitleAfter title="کارت‌های هدیه استفاده‌شده" tag={false} />

        {loading ? (
          <GiftCardsGridSkeleton count={2} />
        ) : usedCards.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {usedCards.map((card) => (
              <GiftCardItem key={card.id} card={card} onDetails={onDetails} />
            ))}
          </div>
        ) : (
          <EmptyState message="کارت هدیه استفاده‌شده‌ای برای نمایش وجود ندارد." />
        )}
      </div>
    </div>
  );
}
