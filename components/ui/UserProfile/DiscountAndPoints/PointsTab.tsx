import React from "react";
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import PointsRules from "./PointsRules";
import PointsSummary from "./PointsSummary";
import PointsHistory from "./PointsHistory";

export default function PointsTab() {
  return (
    <div className="tab-content space-y-6">
      {/* <!-- Points Summary --> */}
      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <TitleAfter title={"خلاصه امتیازات"} tag={false} />
        <PointsSummary />
      </div>

      {/* <!-- Points History --> */}
      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <TitleAfter title={"تاریخچه امتیازات"} tag={false} />

        <PointsHistory />
      </div>

      {/* <!-- Points Rules --> */}
      <PointsRules />
    </div>
  );
}
