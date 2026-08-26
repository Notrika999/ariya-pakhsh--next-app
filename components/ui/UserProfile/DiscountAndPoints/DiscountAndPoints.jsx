"use client";
// components/ui/UserProfile/DiscountAndPoints/DiscountAndPoints.jsx
import React, { useCallback, useEffect, useState } from "react";
import DiscountAndPointsTop from "./DiscountAndPointsTop";
import TabsSection from "../../../modules/TabsSection/TabsSection";
import DiscountCodes from "./DiscountCodes";
import PointsTab from "./PointsTab";
import {
  getMyLoyaltyPointsHistory,
  getMyLoyaltyPointsRules,
  getMyLoyaltyPointsSummary,
  redeemMyLoyaltyPoints,
} from "@/src/services/loyalty/loyalty.client";
import { getMyCoupons } from "@/src/services/coupon/coupon.client";
import { notify } from "@/src/utils/toast";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";

const POINTS_PAGE_SIZE = 20;
const COUPONS_PAGE_SIZE = 3;

const EMPTY_POINTS_SUMMARY = {
  totalPoints: 0,
  usablePoints: 0,
  usedPoints: 0,
  statusKey: "",
};

const EMPTY_POINTS_HISTORY = {
  items: [],
  pageNumber: 1,
  pageSize: POINTS_PAGE_SIZE,
  totalCount: 0,
  totalPages: 1,
  hasPreviousPage: false,
  hasNextPage: false,
};

const EMPTY_POINTS_RULES = {
  enabled: false,
  earnRules: [],
  spendRules: [],
  rules: [],
};

const EMPTY_COUPONS_PAGE = {
  items: [],
  pageNumber: 1,
  pageSize: COUPONS_PAGE_SIZE,
  totalCount: 0,
  totalPages: 1,
  hasPreviousPage: false,
  hasNextPage: false,
};

const COUPON_STATUSES = ["active", "used", "expired"];

export default function DiscountAndPoints() {
  const [activeTab, setActiveTab] = useState("discount-code");
  const [couponPages, setCouponPages] = useState({
    active: EMPTY_COUPONS_PAGE,
    used: EMPTY_COUPONS_PAGE,
    expired: EMPTY_COUPONS_PAGE,
  });
  const [couponPageNumbers, setCouponPageNumbers] = useState({
    active: 1,
    used: 1,
    expired: 1,
  });
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [couponsError, setCouponsError] = useState("");
  const [pointsSummary, setPointsSummary] = useState(EMPTY_POINTS_SUMMARY);
  const [pointsHistory, setPointsHistory] = useState(EMPTY_POINTS_HISTORY);
  const [pointsRules, setPointsRules] = useState(EMPTY_POINTS_RULES);
  const [pointsHistoryPage, setPointsHistoryPage] = useState(1);
  const [pointsLoading, setPointsLoading] = useState(false);
  const [pointsError, setPointsError] = useState("");
  const [redeeming, setRedeeming] = useState(false);

  const loadPointsSummary = useCallback(async () => {
    const summary = await getMyLoyaltyPointsSummary();
    setPointsSummary(summary);
  }, []);

  const loadCoupons = useCallback(async (pageNumbers) => {
    setCouponsLoading(true);
    setCouponsError("");

    try {
      const [active, used, expired] = await Promise.all(
        COUPON_STATUSES.map((status) =>
          getMyCoupons(status, {
            page: pageNumbers[status],
            pageSize: COUPONS_PAGE_SIZE,
          }),
        ),
      );

      setCouponPages({ active, used, expired });
    } catch (error) {
      console.error("[DiscountAndPoints] load coupons failed =>", error);
      setCouponsError(getAuthErrorMessage(error));
    } finally {
      setCouponsLoading(false);
    }
  }, []);

  const loadPointsTab = useCallback(
    async (page) => {
      setPointsLoading(true);
      setPointsError("");

      try {
        const [summary, history, rules] = await Promise.all([
          getMyLoyaltyPointsSummary(),
          getMyLoyaltyPointsHistory({
            page,
            pageSize: POINTS_PAGE_SIZE,
          }),
          getMyLoyaltyPointsRules(),
        ]);

        setPointsSummary(summary);
        setPointsHistory(history);
        setPointsRules(rules);
      } catch (error) {
        console.error("[DiscountAndPoints] load points failed =>", error);
        setPointsError(getAuthErrorMessage(error));
      } finally {
        setPointsLoading(false);
      }
    },
    [],
  );

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void loadPointsSummary().catch((error) => {
      console.error("[DiscountAndPoints] load points summary failed =>", error);
    });
  }, [loadPointsSummary]);

  useEffect(() => {
    if (activeTab !== "my-score") return;
    void loadPointsTab(pointsHistoryPage);
  }, [activeTab, loadPointsTab, pointsHistoryPage]);

  useEffect(() => {
    if (activeTab !== "discount-code") return;
    void loadCoupons(couponPageNumbers);
  }, [activeTab, couponPageNumbers, loadCoupons]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleRedeemPoints = async (points) => {
    if (redeeming) return;

    setRedeeming(true);
    try {
      await redeemMyLoyaltyPoints(points);
      notify.success("امتیاز با موفقیت تبدیل شد");
      await loadPointsTab(pointsHistoryPage);
    } catch (error) {
      console.error("[DiscountAndPoints] redeem points failed =>", error);
      notify.error(getAuthErrorMessage(error));
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <div className="lg:col-span-3 space-y-4">
      {/* <!-- Dashboard header --> */}
      <DiscountAndPointsTop summary={pointsSummary} />

      {/* <!-- Tabs Navigation --> */}
      <TabsSection
        defaultTab="discount-code"
        onChange={setActiveTab}
        tabs={[
          {
            key: "discount-code",
            label: "کدهای تخفیف",
            iconClass: "fa-solid fa-ticket", // 🎁 آیکن هدیه
          },
          {
            key: "my-score",
            label: "امتیازات من",
            iconClass: "fa-solid fa-arrow-trend-up", // 🛒 آیکن خرید
          },
        ]}
      />

      {/* <!-- Discount Codes Tab Content --> */}
      {activeTab === "discount-code" && (
        <DiscountCodes
          pages={couponPages}
          loading={couponsLoading}
          error={couponsError}
          pageSize={COUPONS_PAGE_SIZE}
          onPrevious={(key) =>
            setCouponPageNumbers((pages) => ({
              ...pages,
              [key]: Math.max(1, pages[key] - 1),
            }))
          }
          onNext={(key) =>
            setCouponPageNumbers((pages) => ({
              ...pages,
              [key]: pages[key] + 1,
            }))
          }
        />
      )}

      {/* <!-- Points Tab Content --> */}
      {activeTab === "my-score" && (
        <PointsTab
          summary={pointsSummary}
          historyPage={pointsHistory}
          rules={pointsRules}
          loading={pointsLoading}
          error={pointsError}
          redeeming={redeeming}
          onRedeem={handleRedeemPoints}
          onPreviousHistoryPage={() =>
            setPointsHistoryPage((page) => Math.max(1, page - 1))
          }
          onNextHistoryPage={() => setPointsHistoryPage((page) => page + 1)}
        />
      )}
    </div>
  );
}
