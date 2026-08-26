// components/ui/userProfile/userAddress/UserAddressTop.tsx
import UserProfileTop, { UserProfileTopStat } from "../UserProfileTop";

interface UserAddressTopProps {
  addressLength: number;
}

export default function UserAddressTop({ addressLength }: UserAddressTopProps) {
  return (
    <UserProfileTop
      title="آدرس‌های من"
      titleTag={false}
      description="مدیریت آدرس‌های تحویل سفارشات"
      aside={
        <UserProfileTopStat
          label="تعداد آدرس‌ها"
          value={`${addressLength} آدرس`}
          id="addressesCount"
          iconClassName="bg-blue-100 dark:bg-blue-900"
          icon={
            <i className="far fa-location-dot text-xl text-blue-600 dark:text-blue-400"></i>
          }
        />
      }
    />
  );
}
