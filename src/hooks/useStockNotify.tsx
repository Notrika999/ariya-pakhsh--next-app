"use client";

import { useCallback, useState } from "react";
import StockNotifyModal from "@/components/modules/StockNotifyModal/StockNotifyModal";
import { useIsAuthenticated } from "@/src/lib/stores/auth/auth.store";
import { notify } from "@/src/utils/toast";

export function useStockNotify() {
  const isAuthenticated = useIsAuthenticated();
  const [open, setOpen] = useState(false);

  const requestNotify = useCallback(() => {
    if (isAuthenticated) {
      notify.success("درخواست شما ثبت شد");
      return;
    }

    setOpen(true);
  }, [isAuthenticated]);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, []);

  const stockNotifyModal = (
    <StockNotifyModal open={open} onClose={closeModal} />
  );

  return { requestNotify, stockNotifyModal };
}
