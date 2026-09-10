import UserProfileTop, { UserProfileTopStat } from "../UserProfileTop";

type MyCarsTopProps = {
  vehicleCount: number;
};

export default function MyCarsTop({ vehicleCount }: MyCarsTopProps) {
  return (
    <UserProfileTop
      title="لیست خودروهای من"
      titleTag={false}
      description="مدیریت خودروهای ثبت‌شده برای بررسی سازگاری محصولات"
      aside={
        <UserProfileTopStat
          label="تعداد خودروها"
          value={`${vehicleCount} خودرو`}
          id="vehiclesCount"
          iconClassName="bg-blue-100 dark:bg-blue-900"
          icon={
            <i className="far fa-car text-xl text-blue-600 dark:text-blue-400" />
          }
        />
      }
    />
  );
}
