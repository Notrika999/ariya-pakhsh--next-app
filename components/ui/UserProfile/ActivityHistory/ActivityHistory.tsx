"use client";
// components/ui/UserProfile/ActivityHistory/ActivityHistory.tsx
import React, { useCallback, useEffect, useState } from "react";
import ActivityHistoryTop from "./ActivityHistoryTop";
import ActivityHistoryRecentViews from "./ActivityHistoryRecentViews";
import ActivityHistoryRecentActivities from "./ActivityHistoryRecentActivities";
import TabsNavigation from "../../../modules/TabsNavigation/TabsNavigation";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";
import {
  clearMyActivityVisits,
  deleteMyActivityVisit,
  getMyActivityFeed,
  getMyActivitySummary,
  getMyActivityVisits,
} from "@/src/services/activity/activity.client";
import { notify } from "@/src/utils/toast";
import type {
  ActivityFeedPage,
  ActivitySummary,
  ActivityVisitsPage,
  TabItem,
} from "@/src/lib/types/userpanel/activity-history";

const RECENT_VIEWS_PAGE_SIZE = 20;
const RECENT_ACTIVITIES_PAGE_SIZE = 10;

const EMPTY_SUMMARY: ActivitySummary = {
  totalVisitCount: 0,
  stats: {
    productVisits: 0,
    purchases: 0,
    comments: 0,
    tickets: 0,
  },
};

export default function ActivityHistory() {
  const [activeTab, setActiveTab] = useState<string>("recent-views");
  const [summary, setSummary] = useState<ActivitySummary>(EMPTY_SUMMARY);
  const [visitsPage, setVisitsPage] = useState<ActivityVisitsPage | null>(null);
  const [feedPage, setFeedPage] = useState<ActivityFeedPage | null>(null);
  const [feedPageNumber, setFeedPageNumber] = useState(1);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [visitsLoading, setVisitsLoading] = useState(false);
  const [feedLoading, setFeedLoading] = useState(false);
  const [visitsError, setVisitsError] = useState("");
  const [feedError, setFeedError] = useState("");
  const [clearingHistory, setClearingHistory] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState("");

  const tabs: TabItem[] = [
    { id: "recent-views", title: "آخرین بازدیدها", icon: "fa-regular fa-eye" },
    {
      id: "recent-activities",
      title: "فعالیت‌های اخیر",
      icon: "fa-regular fa-clock",
    },
  ];

  const loadSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const data = await getMyActivitySummary();
      setSummary(data);
    } catch (error) {
      notify.error(getAuthErrorMessage(error));
      setSummary(EMPTY_SUMMARY);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  const loadVisits = useCallback(async () => {
    setVisitsLoading(true);
    setVisitsError("");
    try {
      const data = await getMyActivityVisits({
        page: 1,
        pageSize: RECENT_VIEWS_PAGE_SIZE,
      });
      setVisitsPage(data);
    } catch (error) {
      const message = getAuthErrorMessage(error);
      setVisitsError(message);
      setVisitsPage(null);
      notify.error(message);
    } finally {
      setVisitsLoading(false);
    }
  }, []);

  const loadFeed = useCallback(async () => {
    setFeedLoading(true);
    setFeedError("");
    try {
      const data = await getMyActivityFeed({
        page: feedPageNumber,
        pageSize: RECENT_ACTIVITIES_PAGE_SIZE,
      });
      setFeedPage(data);
    } catch (error) {
      const message = getAuthErrorMessage(error);
      setFeedError(message);
      setFeedPage(null);
      notify.error(message);
    } finally {
      setFeedLoading(false);
    }
  }, [feedPageNumber]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadSummary();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadSummary]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (activeTab === "recent-views") {
        void loadVisits();
        return;
      }

      void loadFeed();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [activeTab, loadFeed, loadVisits]);

  const handleClearHistory = useCallback(async () => {
    if (clearingHistory || visitsLoading) return;
    const confirmed = window.confirm(
      "آیا از پاک کردن کامل تاریخچه بازدیدها مطمئن هستید؟",
    );
    if (!confirmed) return;

    setClearingHistory(true);
    try {
      await clearMyActivityVisits();
      notify.success("تاریخچه بازدیدها پاک شد");
      await Promise.all([loadSummary(), loadVisits()]);
    } catch (error) {
      notify.error(getAuthErrorMessage(error));
    } finally {
      setClearingHistory(false);
    }
  }, [clearingHistory, loadSummary, loadVisits, visitsLoading]);

  const handleDeleteVisit = useCallback(
    async (productId: string) => {
      if (!productId || deletingProductId) return;

      setDeletingProductId(productId);
      try {
        await deleteMyActivityVisit(productId);
        notify.success("آیتم از تاریخچه بازدید حذف شد");
        await Promise.all([loadSummary(), loadVisits()]);
      } catch (error) {
        notify.error(getAuthErrorMessage(error));
      } finally {
        setDeletingProductId("");
      }
    },
    [deletingProductId, loadSummary, loadVisits],
  );

  return (
    <div className="space-y-8 lg:col-span-3">
      <ActivityHistoryTop summary={summary} loading={summaryLoading} />

      <TabsNavigation
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "recent-views" && (
        <ActivityHistoryRecentViews
          groups={visitsPage?.groups ?? []}
          totalProducts={visitsPage?.totalProducts ?? 0}
          loading={visitsLoading}
          error={visitsError}
          clearingHistory={clearingHistory}
          deletingProductId={deletingProductId}
          onClearHistory={handleClearHistory}
          onDeleteVisit={handleDeleteVisit}
          onRetry={loadVisits}
        />
      )}

      {activeTab === "recent-activities" && (
        <ActivityHistoryRecentActivities
          items={feedPage?.items ?? []}
          stats={feedPage?.stats ?? summary.stats}
          totalCount={feedPage?.totalCount ?? 0}
          currentPage={feedPageNumber}
          loading={feedLoading}
          error={feedError}
          pageSize={RECENT_ACTIVITIES_PAGE_SIZE}
          onPreviousPage={() =>
            setFeedPageNumber((page) => Math.max(1, page - 1))
          }
          onNextPage={() => setFeedPageNumber((page) => page + 1)}
          onRetry={loadFeed}
        />
      )}
    </div>
  );
}
