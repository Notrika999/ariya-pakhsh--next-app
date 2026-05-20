import GiftCardItem from "@/components/modules/GiftCardItem/GiftCardItem";
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";

import { GiftCard } from "@/src/lib/types/userpanel/GiftCard";

export default function MyGiftCards({ data }) {
  const activeCards = data.filter((c) => c.type === "active");
  const usedCards = data.filter(
    (c) => c.type === "used" || c.type === "expired",
  );

  return (
    <div id="my-gift-cards" className="tab-content space-y-6">
      {/* Active Cards */}
      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <TitleAfter title="کارت‌های هدیه فعال" tag={false} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCards.map((card) => (
            <GiftCardItem key={card.id} card={card} />
          ))}
        </div>
      </div>

      {/* Used / Expired Cards */}
      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <TitleAfter title="کارت‌های هدیه استفاده شده" tag={false} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {usedCards.map((card) => (
            <GiftCardItem key={card.id} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
}
