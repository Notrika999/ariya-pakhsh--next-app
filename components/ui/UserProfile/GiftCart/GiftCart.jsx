"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import GiftCartTop from "./GiftCartTop";
import TabsSection from "../../../modules/TabsSection/TabsSection";
import MyGiftCards from "./MyGiftCards";
import BuyGiftCard from "./BuyGiftCard";
import {
  getActiveGiftCards,
  getGiftCardById,
  getUsedGiftCards,
} from "@/src/services/gift-card/gift-card.client";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";
import { notify } from "@/src/utils/toast";

function formatMoney(value, currency) {
  const amount = new Intl.NumberFormat("fa-IR").format(
    Math.max(0, Math.round(Number(value) || 0)),
  );

  return `${amount} ${currency || "تومان"}`;
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function GiftCardDetailModal({ card, loading, onClose }) {
  if (!card && !loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="بستن"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-custom-dark">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-gray-100">
              جزئیات کارت هدیه
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              اطلاعات کامل کارت انتخاب‌شده
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-10 animate-pulse rounded-lg bg-gray-100 dark:bg-zinc-800"
              />
            ))}
          </div>
        ) : card ? (
          <div className="space-y-3 text-sm">
            {[
              ["عنوان", card.title || "کارت هدیه"],
              ["کد", card.code],
              ["مبلغ اولیه", formatMoney(card.amount, "تومان")],
              ["مانده", formatMoney(card.remainingBalance, "تومان")],
              ["تاریخ انقضا", formatDate(card.expiresAt)],
              ["وضعیت", card.statusTitle || card.statusKey],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 px-4 py-3 dark:bg-zinc-900/60"
              >
                <span className="text-gray-500 dark:text-gray-400">
                  {label}
                </span>
                <span className="break-all text-left font-bold text-gray-900 dark:text-gray-100">
                  {value}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function GiftCart() {
  const [activeTab, setActiveTab] = useState("my-gift-cards");
  const [activeCards, setActiveCards] = useState([]);
  const [usedCards, setUsedCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const totalActiveBalance = useMemo(
    () =>
      activeCards.reduce(
        (total, card) => total + (Number(card.remainingBalance) || 0),
        0,
      ),
    [activeCards],
  );

  const balanceCurrency = activeCards.find((card) => card.currency)?.currency;

  const loadGiftCards = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [activeResult, usedResult] = await Promise.all([
        getActiveGiftCards(),
        getUsedGiftCards(),
      ]);

      setActiveCards(activeResult.items);
      setUsedCards(usedResult.items);
    } catch (err) {
      console.error("[GiftCart] load gift cards failed =>", err);
      setError(getAuthErrorMessage(err));
      setActiveCards([]);
      setUsedCards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadGiftCards();
  }, [loadGiftCards]);

  const handleShowDetails = async (id) => {
    setDetailLoading(true);
    setSelectedCard(null);

    try {
      const card = await getGiftCardById(id);
      setSelectedCard(card);
    } catch (err) {
      console.error("[GiftCart] load gift card detail failed =>", err);
      notify.error(getAuthErrorMessage(err));
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="space-y-8 lg:col-span-3">
      <GiftCartTop totalBalance={totalActiveBalance} currency={"تومان"} />

      <TabsSection
        defaultTab="my-gift-cards"
        onChange={setActiveTab}
        tabs={[
          {
            key: "my-gift-cards",
            label: "کارت‌های هدیه من",
            iconClass: "fa-solid fa-gift",
          },
          // {
          //   key: "buy-gift-card",
          //   label: "خرید کارت هدیه",
          //   iconClass: "fa-solid fa-cart-shopping",
          // },
        ]}
      />

      {activeTab === "my-gift-cards" ? (
        <MyGiftCards
          activeCards={activeCards}
          usedCards={usedCards}
          loading={loading}
          error={error}
          onRetry={loadGiftCards}
          onDetails={handleShowDetails}
        />
      ) : null}

      {activeTab === "buy-gift-card" ? <BuyGiftCard /> : null}

      <GiftCardDetailModal
        card={selectedCard}
        loading={detailLoading}
        onClose={() => {
          setSelectedCard(null);
          setDetailLoading(false);
        }}
      />
    </div>
  );
}
