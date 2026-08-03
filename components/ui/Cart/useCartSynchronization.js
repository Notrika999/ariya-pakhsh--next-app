"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  acceptCartChanges,
  removeCartItem,
  synchronizeCart,
} from "@/src/services/cart/cart.client";
import {
  useIsAuthenticated,
  useIsAuthBootstrapping,
} from "@/src/lib/stores/auth/auth.store";
import { notify } from "@/src/utils/toast";

const STOCK_ISSUE_PATTERN =
  /(stock|inventory|outofstock|out-of-stock|out_of_stock|unavailable|quantity|soldout|sold-out|sold_out)/i;

function unique(values) {
  return Array.from(
    new Set(values.map((value) => String(value || "").trim())),
  ).filter(Boolean);
}

function getIssues(item) {
  return Array.isArray(item?.issues) ? item.issues : [];
}

function hasStockIssue(item) {
  return getIssues(item).some((issue) =>
    STOCK_ISSUE_PATTERN.test(String(issue?.issueType || "")),
  );
}

function hasErrorIssue(item) {
  return (
    Number(item?.quantity || 0) <= 0 ||
    hasStockIssue(item) ||
    getIssues(item).some(
      (issue) => String(issue?.severity || "").toLowerCase() === "error",
    )
  );
}

function hasWarningIssue(item) {
  return getIssues(item).some(
    (issue) => String(issue?.severity || "").toLowerCase() === "warning",
  );
}

function buildSyncState(syncData) {
  if (!syncData?.hasErrors && !syncData?.hasWarnings) return null;

  const items = Array.isArray(syncData?.items)
    ? syncData.items.filter((item) => getIssues(item).length > 0)
    : [];
  const errorItems = syncData.hasErrors ? items.filter(hasErrorIssue) : [];
  const errorVariantIds = new Set(errorItems.map((item) => item.variantId));
  const warningItems = syncData.hasWarnings
    ? items.filter(
        (item) =>
          !errorVariantIds.has(item.variantId) &&
          (hasWarningIssue(item) || !hasErrorIssue(item)),
      )
    : [];

  if (errorItems.length === 0 && warningItems.length === 0) return null;

  return {
    errorItems,
    warningItems,
  };
}

function createWarningState(items) {
  return {
    hasErrors: false,
    hasWarnings: true,
    phase: "warning",
    errorItems: [],
    warningItems: items,
    items,
  };
}

function createErrorState(items) {
  return {
    hasErrors: true,
    hasWarnings: false,
    phase: "error",
    errorItems: items,
    warningItems: [],
    items,
  };
}

export function useCartSynchronization({ enabled, refreshCart }) {
  const isAuthenticated = useIsAuthenticated();
  const isAuthBootstrapping = useIsAuthBootstrapping();
  const canCheckServerCart =
    enabled && isAuthenticated && !isAuthBootstrapping;
  const [checking, setChecking] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [syncState, setSyncState] = useState(null);
  const checkedRef = useRef(false);
  const pendingErrorItemsRef = useRef([]);
  const activeSyncState = canCheckServerCart ? syncState : null;

  const showErrorStateOrClose = useCallback((errorItems) => {
    if (errorItems.length > 0) {
      setSyncState(createErrorState(errorItems));
      return;
    }

    setSyncState(null);
  }, []);

  const checkCart = useCallback(async () => {
    if (checking || actionLoading || syncState) return;

    setChecking(true);
    try {
      const response = await synchronizeCart();
      const nextSyncState = buildSyncState(response);
      pendingErrorItemsRef.current = nextSyncState?.errorItems || [];

      if (nextSyncState?.warningItems?.length > 0) {
        setSyncState(createWarningState(nextSyncState.warningItems));
      } else if (nextSyncState?.errorItems?.length > 0) {
        pendingErrorItemsRef.current = [];
        setSyncState(createErrorState(nextSyncState.errorItems));
      } else {
        setSyncState(null);
      }
    } catch {
      notify.error("بررسی وضعیت سبد خرید ناموفق بود");
    } finally {
      setChecking(false);
    }
  }, [actionLoading, checking, syncState]);

  useEffect(() => {
    if (!canCheckServerCart) {
      checkedRef.current = false;
      pendingErrorItemsRef.current = [];
      return;
    }

    if (checkedRef.current) return;
    checkedRef.current = true;
    void checkCart();
  }, [canCheckServerCart, checkCart]);

  const refresh = useCallback(async () => {
    if (typeof refreshCart === "function") {
      await refreshCart();
    }
  }, [refreshCart]);

  const removeItems = useCallback(async (itemsToRemove) => {
    const variantIds = unique(itemsToRemove.map((item) => item.variantId));
    await Promise.all(variantIds.map((variantId) => removeCartItem(variantId)));
  }, []);

  const acceptWarnings = useCallback(async (itemsToAccept) => {
    const productIds = unique(itemsToAccept.map((item) => item.productId));
    if (productIds.length > 0) {
      await acceptCartChanges(productIds);
    }
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!syncState || actionLoading) return;

    setActionLoading(true);
    try {
      if (syncState.phase === "error") {
        await removeItems(syncState.errorItems);
        await refresh();
        pendingErrorItemsRef.current = [];
        setSyncState(null);
        notify.success("سبد خرید برای تکمیل خرید آماده شد");
        return;
      }

      await acceptWarnings(syncState.warningItems);
      await refresh();

      const nextErrorItems = pendingErrorItemsRef.current;
      pendingErrorItemsRef.current = [];
      showErrorStateOrClose(nextErrorItems);

      if (nextErrorItems.length === 0) {
        notify.success("سبد خرید برای تکمیل خرید آماده شد");
      }
    } catch {
      notify.error("به‌روزرسانی سبد خرید ناموفق بود");
    } finally {
      setActionLoading(false);
    }
  }, [
    acceptWarnings,
    actionLoading,
    refresh,
    removeItems,
    showErrorStateOrClose,
    syncState,
  ]);

  const handleCancel = useCallback(async () => {
    if (!syncState || actionLoading || syncState.phase === "error") return;

    setActionLoading(true);
    try {
      await removeItems(syncState.warningItems);
      await refresh();

      const nextErrorItems = pendingErrorItemsRef.current;
      pendingErrorItemsRef.current = [];
      showErrorStateOrClose(nextErrorItems);

      if (nextErrorItems.length === 0) {
        notify.success("کالاهای تغییر کرده از سبد خرید حذف شدند");
      }
    } catch {
      notify.error("حذف کالاهای تغییر کرده ناموفق بود");
    } finally {
      setActionLoading(false);
    }
  }, [actionLoading, refresh, removeItems, showErrorStateOrClose, syncState]);

  const modalProps = useMemo(
    () => ({
      actionLoading,
      onCancel: handleCancel,
      onConfirm: handleConfirm,
      syncState: activeSyncState,
    }),
    [actionLoading, activeSyncState, handleCancel, handleConfirm],
  );

  return {
    canCheckout: !checking && !actionLoading && !activeSyncState,
    checking,
    modalProps,
  };
}
