import DiscountCard from "@/components/modules/DiscountCard/DiscountCard";
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import { DiscountCode } from "@/src/lib/types/userpanel/Discount";

interface DiscountCodesProps {
  data: DiscountCode[];
}

export default function DiscountCodes({ data }: DiscountCodesProps) {
  const active = data.filter((d) => d.status === "active");
  const expired = data.filter((d) => d.status === "expired");

  return (
    <div className="space-y-6">
      {/* Active */}
      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <TitleAfter title={"کدهای تخفیف فعال"} tag={false} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {active.map((item) => (
            <DiscountCard key={item.id} data={item} />
          ))}
        </div>
      </div>

      {/* Expired */}
      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <TitleAfter title={"کدهای تخفیف منقضی شده"} tag={false} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expired.map((item) => (
            <DiscountCard key={item.id} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
