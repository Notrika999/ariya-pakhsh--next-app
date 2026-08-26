import UserProfileTop, { UserProfileTopStat } from "../UserProfileTop";

function formatMoney(value, currency = "تومان") {
  const amount = new Intl.NumberFormat("fa-IR").format(
    Math.max(0, Math.round(Number(value) || 0)),
  );

  return `${amount} ${currency}`;
}

export default function GiftCartTop({ totalBalance = 0, currency = "تومان" }) {
  return (
    <UserProfileTop
      title="کارت‌های هدیه"
      description="مدیریت و خرید کارت‌های هدیه"
      aside={
        <UserProfileTopStat
          label="موجودی کل"
          value={formatMoney(totalBalance, currency)}
          valueClassName="text-2xl font-bold text-primary"
          icon={<i className="far fa-gift text-xl text-white"></i>}
        />
      }
    />
  );
}
