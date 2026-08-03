import React from "react";
import type {
  LoyaltyPointsRule,
  LoyaltyPointsRules,
} from "@/src/lib/types/userpanel/loyalty";

type PointsRulesProps = {
  rules: LoyaltyPointsRules;
};

function RuleList({
  title,
  iconClass,
  iconColor,
  items,
}: {
  title: string;
  iconClass: string;
  iconColor: string;
  items: LoyaltyPointsRule[];
}) {
  const numberFormatter = new Intl.NumberFormat("fa-IR");

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
        {title}
      </h3>
      {items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((rule) => (
            <li key={rule.id || rule.key} className="flex items-start space-x-3">
              <i className={`${iconClass} ${iconColor} mt-0.5 shrink-0`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {rule.title || rule.description}
                {rule.points ? (
                  <span className="ms-1 font-medium">
                    ({numberFormatter.format(rule.points)} امتیاز)
                  </span>
                ) : null}
                {rule.title && rule.description ? (
                  <span className="mt-1 block text-xs text-gray-500 dark:text-gray-500">
                    {rule.description}
                  </span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          قانونی ثبت نشده است.
        </p>
      )}
    </div>
  );
}

export default function PointsRules({ rules }: PointsRulesProps) {
  return (
    <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
      <h2 className="font-bold text-xl with-highlight dark:text-gray-200 mb-6">
        قوانین امتیازات
      </h2>

      {!rules.enabled ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          سیستم امتیازدهی در حال حاضر فعال نیست.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RuleList
            title="روش‌های کسب امتیاز"
            iconClass="far fa-check"
            iconColor="text-green-500"
            items={rules.earnRules}
          />
          <RuleList
            title="روش‌های استفاده"
            iconClass="far fa-dollar"
            iconColor="text-blue-500 text-xs"
            items={rules.spendRules}
          />
        </div>
      )}
    </div>
  );
}
