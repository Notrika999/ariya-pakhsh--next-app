"use client";
// components/ui/UserProfile/CreditHistory/GatewaySelectModal.jsx
import { useEffect, useState } from "react";
import { getCheckoutPaymentMethods } from "@/src/services/checkout/checkout.client";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";

function isGiftCardPaymentMethod(method) {
  if (!method) return false;
  const value = `${method.code} ${method.title}`.toLowerCase();
  return (
    value.includes("gift") ||
    value.includes("giftcard") ||
    value.includes("gift-card") ||
    value.includes("gift_card") ||
    value.includes("کارت هدیه")
  );
}

function isInstallmentPaymentMethod(method) {
  if (!method) return false;
  const value =
    `${method.code} ${method.title} ${method.description}`.toLowerCase();
  return (
    method.code === "installment_provider" ||
    value.includes("installment") ||
    value.includes("اقساط") ||
    (method.providers ?? []).some(
      (provider) => provider.gatewayType === "installment",
    )
  );
}

function isWalletPaymentMethod(method) {
  if (!method) return false;
  const value = `${method.code} ${method.title}`.toLowerCase();
<<<<<<< HEAD
  return value.includes("wallet") || value.includes("کیف پول");
=======
  return (
    value.includes("wallet") ||
    value.includes("کیف پول")
  );
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
}

function isBankGatewayPaymentMethod(method) {
  if (
    !method ||
    isGiftCardPaymentMethod(method) ||
    isInstallmentPaymentMethod(method) ||
    isWalletPaymentMethod(method)
  ) {
    return false;
  }

  const value =
    `${method.code} ${method.title} ${method.description}`.toLowerCase();
  return (
    (method.providers?.length ?? 0) > 0 ||
    value.includes("gateway") ||
    value.includes("online") ||
    value.includes("bank") ||
    value.includes("درگاه") ||
    value.includes("آنلاین") ||
    value.includes("بانک")
  );
}

function getRenderableImageSrc(value) {
  const src = typeof value === "string" ? value.trim() : "";
  if (!src) return null;
  if (src.startsWith("/") || /^https?:\/\//i.test(src)) return src;
  return null;
}

<<<<<<< HEAD
function collectGatewayItems(methods, excludedProviderCode) {
  const items = [];
  const normalizedExcludedProviderCode = excludedProviderCode
    ?.trim()
    .toLowerCase();
=======
function collectGatewayItems(methods) {
  const items = [];
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c

  for (const method of methods) {
    if (!method?.isAvailable || !isBankGatewayPaymentMethod(method)) continue;

    const providers = (method.providers ?? []).filter(
      (provider) =>
        provider?.isAvailable !== false &&
        provider?.code &&
<<<<<<< HEAD
        provider.code.trim().toLowerCase() !== normalizedExcludedProviderCode &&
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
        provider.gatewayType !== "installment",
    );

    if (providers.length > 0) {
      for (const provider of providers) {
        items.push({
          id: `${method.code}:${provider.code}`,
          methodCode: method.code,
          providerCode: provider.code,
          title: provider.title || method.title,
          description: provider.description || method.description || "",
          imageUrl:
            provider.imageUrl || provider.logoUrl || method.imageUrl || null,
        });
      }
      continue;
    }

    items.push({
      id: method.code,
      methodCode: method.code,
      providerCode: undefined,
      title: method.title,
      description: method.description || "",
      imageUrl: method.imageUrl || null,
    });
  }

  return items;
}

export default function GatewaySelectModal({
  open,
  amountLabel,
  confirming = false,
<<<<<<< HEAD
  excludedProviderCode,
  compact = false,
=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  onClose,
  onConfirm,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gateways, setGateways] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function loadGateways() {
      setLoading(true);
      setError("");
      setGateways([]);
      setSelectedId(null);

      try {
        const methods = await getCheckoutPaymentMethods();
        if (cancelled) return;

<<<<<<< HEAD
        const items = collectGatewayItems(methods, excludedProviderCode);
=======
        const items = collectGatewayItems(methods);
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
        setGateways(items);
        setSelectedId(items[0]?.id ?? null);
        if (items.length === 0) {
          setError("درگاه پرداخت در دسترس نیست");
        }
      } catch (err) {
        if (cancelled) return;
        setError(getAuthErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadGateways();

    return () => {
      cancelled = true;
    };
<<<<<<< HEAD
  }, [excludedProviderCode, open]);
=======
  }, [open]);
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !confirming) onClose?.();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, confirming, onClose]);

  if (!open) return null;

  const selectedGateway = gateways.find((item) => item.id === selectedId);
  const busy = loading || confirming;

  const handleConfirm = () => {
    if (!selectedGateway || busy) return;
    onConfirm?.(selectedGateway);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => {
          if (!confirming) onClose?.();
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="gateway-select-title"
<<<<<<< HEAD
        className={[
          "relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white shadow-xl dark:border dark:border-gray-700 dark:bg-custom-dark",
          compact ? "max-w-xl p-4 sm:p-5" : "max-w-lg p-6",
        ].join(" ")}
      >
        <div
          className={`flex items-start justify-between gap-3 ${compact ? "mb-4" : "mb-5"}`}
        >
=======
        className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:border dark:border-gray-700 dark:bg-custom-dark"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
          <div>
            <h2
              id="gateway-select-title"
              className="text-lg font-bold text-gray-800 dark:text-gray-100"
            >
<<<<<<< HEAD
              {compact ? "انتخاب روش پرداخت" : "انتخاب درگاه پرداخت"}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {compact
                ? "روش مورد نظر را انتخاب کنید و سپس پرداخت را ادامه دهید."
                : "درگاه مورد نظر را انتخاب کنید و سپس پرداخت را ادامه دهید."}
=======
              انتخاب درگاه پرداخت
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              درگاه مورد نظر را انتخاب کنید و سپس پرداخت را ادامه دهید.
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
            </p>
            {amountLabel ? (
              <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                مبلغ: {amountLabel}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => {
              if (!confirming) onClose?.();
            }}
            disabled={confirming}
            aria-label="بستن"
            className="flex size-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-zinc-800"
          >
            <i className="far fa-x text-sm" />
          </button>
        </div>

        {loading ? (
<<<<<<< HEAD
          <div
            className={
              compact
                ? "grid grid-cols-1 gap-2.5 sm:grid-cols-2"
                : "grid grid-cols-2 gap-3 sm:grid-cols-3"
            }
          >
            {Array.from({ length: compact ? 4 : 3 }, (_, index) => (
              <div
                key={`gateway-skeleton-${index}`}
                className={`${compact ? "h-[76px]" : "h-36"} animate-pulse rounded-xl bg-gray-100 dark:bg-zinc-800`}
=======
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={`gateway-skeleton-${index}`}
                className="h-36 animate-pulse rounded-xl bg-gray-100 dark:bg-zinc-800"
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
              />
            ))}
          </div>
        ) : error ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </p>
        ) : (
<<<<<<< HEAD
          <div
            className={
              compact
                ? "grid grid-cols-1 gap-2.5 sm:grid-cols-2"
                : "grid grid-cols-2 gap-3 sm:grid-cols-3"
            }
          >
=======
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
            {gateways.map((gateway) => {
              const isSelected = selectedId === gateway.id;
              const imageSrc = getRenderableImageSrc(gateway.imageUrl);

              return (
                <button
                  key={gateway.id}
                  type="button"
                  disabled={confirming}
                  onClick={() => setSelectedId(gateway.id)}
                  className={[
<<<<<<< HEAD
                    "relative rounded-xl border transition-all disabled:cursor-not-allowed disabled:opacity-60",
                    compact
                      ? "flex min-h-[76px] items-center gap-3 p-2.5 text-start"
                      : "flex h-36 flex-col items-center justify-center gap-2 p-3 text-center",
=======
                    "flex h-36 flex-col items-center justify-center gap-2 rounded-xl border p-3 text-center transition-all disabled:cursor-not-allowed",
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
                    isSelected
                      ? "border-primary bg-blue-50 ring-2 ring-primary/20 dark:bg-zinc-800"
                      : "border-gray-200 bg-white hover:border-primary dark:border-gray-600 dark:bg-zinc-900",
                  ].join(" ")}
                >
                  {imageSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageSrc}
                      alt={gateway.title}
<<<<<<< HEAD
                      className={`${compact ? "size-10" : "h-12 w-12"} shrink-0 object-contain`}
                    />
                  ) : (
                    <span
                      className={`${compact ? "size-10" : "size-12"} flex shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary`}
                    >
                      <i
                        className={`far fa-building-columns ${compact ? "text-lg" : "text-2xl"}`}
                      />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-gray-800 dark:text-gray-100">
                      {gateway.title}
                    </span>
                    {compact && gateway.description ? (
                      <span className="mt-1 block line-clamp-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                        {gateway.description}
                      </span>
                    ) : null}
                  </span>
                  {compact && isSelected ? (
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                      <i className="far fa-check" />
                    </span>
                  ) : null}
=======
                      className="h-12 w-12 object-contain"
                    />
                  ) : (
                    <i className="far fa-building-columns text-2xl text-primary" />
                  )}
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {gateway.title}
                  </span>
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
                </button>
              );
            })}
          </div>
        )}

<<<<<<< HEAD
        <div
          className={`flex items-center justify-end gap-3 ${compact ? "mt-4" : "mt-6"}`}
        >
=======
        <div className="mt-6 flex items-center justify-end gap-3">
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
          <button
            type="button"
            disabled={confirming}
            onClick={() => onClose?.()}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-zinc-800"
          >
            انصراف
          </button>
          <button
            type="button"
            disabled={busy || !selectedGateway}
            onClick={handleConfirm}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {confirming ? "در حال پرداخت..." : "ادامه پرداخت"}
          </button>
        </div>
      </div>
    </div>
  );
}
