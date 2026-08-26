import React, { useState } from "react";
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import PointsRules from "./PointsRules";
import PointsSummary from "./PointsSummary";
import PointsHistory from "./PointsHistory";
import type {
  LoyaltyPointsHistoryPage,
  LoyaltyPointsRules,
  LoyaltyPointsSummary,
} from "@/src/lib/types/userpanel/loyalty";

type PointsTabProps = {
  summary: LoyaltyPointsSummary;
  historyPage: LoyaltyPointsHistoryPage;
  rules: LoyaltyPointsRules;
  loading: boolean;
  error: string;
  redeeming: boolean;
  onRedeem: (points: number) => Promise<void>;
  onPreviousHistoryPage: () => void;
  onNextHistoryPage: () => void;
};

export default function PointsTab({
  summary,
  historyPage,
  rules,
  loading,
  error,
  redeeming,
  onRedeem,
  onPreviousHistoryPage,
  onNextHistoryPage,
}: PointsTabProps) {
  const [redeemPoints, setRedeemPoints] = useState("");
  const numericRedeemPoints = Number(redeemPoints);

  return (
    <div className="tab-content space-y-2">
      {error ? (
        <div className="rounded-2xl bg-white p-6 text-sm text-red-500 drop-shadow-lg dark:bg-custom-dark dark:border dark:border-gray-700">
          {error}
        </div>
      ) : null}

      <div className="bg-white rounded-2xl drop-shadow-lg px-3 py-2 dark:bg-custom-dark dark:border dark:border-gray-700">
        <TitleAfter title={"خلاصه امتیازات"} tag={false} />
        <PointsSummary summary={summary} />
      </div>

      <div className="bg-white rounded-2xl drop-shadow-lg px-3 py-2 dark:bg-custom-dark dark:border dark:border-gray-700">
        <TitleAfter title={"تبدیل امتیاز"} tag={false} />
        <form
          className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end"
          onSubmit={(event) => {
            event.preventDefault();
            if (!Number.isFinite(numericRedeemPoints) || numericRedeemPoints <= 0) {
              return;
            }

            void onRedeem(numericRedeemPoints).then(() => setRedeemPoints(""));
          }}
        >
          <label className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-200">
            مقدار امتیاز
            <input
              type="number"
              min={1}
              max={summary.usablePoints || undefined}
              value={redeemPoints}
              onChange={(event) => setRedeemPoints(event.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-zinc-900"
              placeholder="مثلا ۱۰۰"
            />
          </label>
          <button
            type="submit"
            disabled={
              redeeming ||
              !Number.isFinite(numericRedeemPoints) ||
              numericRedeemPoints <= 0 ||
              numericRedeemPoints > summary.usablePoints
            }
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {redeeming ? "در حال تبدیل..." : "تبدیل امتیاز"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl drop-shadow-lg px-3 py-2 dark:bg-custom-dark dark:border dark:border-gray-700">
        <TitleAfter title={"تاریخچه امتیازات"} tag={false} />

        <PointsHistory
          page={historyPage}
          loading={loading}
          onPrevious={onPreviousHistoryPage}
          onNext={onNextHistoryPage}
        />
      </div>

      <PointsRules rules={rules} />
    </div>
  );
}
