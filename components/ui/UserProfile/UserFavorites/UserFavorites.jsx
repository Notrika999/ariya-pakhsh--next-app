"use client";
// components/ui/UserProfile/UserFavorites/UserFavorites.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";

import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import UserFavoritesTop from "./UserFavoritesTop";
import FavoriteCard from "../../../modules/FavoriteCard/FavoriteCard";
import FilterBar from "../../../modules/FilterBar/FilterBar";
import UserProfileEmptyState from "../UserProfileEmptyState";
import {
  getMyWishlist,
  removeWishlistProduct,
} from "@/src/services/wishlist/wishlist.client";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";
import { getProductImage } from "@/src/utils/product-image";
import { formatPrice } from "@/src/utils/formatPrice";
import { notify } from "@/src/utils/toast";
import { FavoritesGridSkeleton } from "../skeletons/UserProfileSkeletons";

const PAGE_SIZE = 12;

function getDisplayPrice(item) {
  if (item.isOnSale && item.salePrice != null && item.salePrice > 0) {
    return item.salePrice;
  }
  return item.currentPrice;
}

function getOriginalPrice(item) {
  const display = getDisplayPrice(item);
  if (item.isOnSale && item.currentPrice > display) {
    return item.currentPrice;
  }
  if (item.priceWhenAdded > display) {
    return item.priceWhenAdded;
  }
  return null;
}

function getDiscountPercent(item) {
  const original = getOriginalPrice(item);
  const display = getDisplayPrice(item);
  if (!original || original <= display) return null;
  return Math.round(((original - display) / original) * 100);
}

export default function UserFavorites() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [sort, setSort] = useState("recent");
  const [search, setSearch] = useState("");

  const applyWishlistPage = useCallback((data, fallbackPage = 1) => {
    setItems(data.items);
    setPage(data.pageNumber || fallbackPage);
    setTotalCount(data.totalCount);
    setTotalPages(Math.max(1, data.totalPages || 1));
    setHasPreviousPage(Boolean(data.hasPreviousPage));
    setHasNextPage(Boolean(data.hasNextPage));
  }, []);

  const loadWishlist = useCallback(
    async (pageNumber = 1) => {
      setLoading(true);
      try {
        const data = await getMyWishlist({
          pageNumber,
          pageSize: PAGE_SIZE,
        });
        applyWishlistPage(data, pageNumber);
      } catch (error) {
        notify.error(getAuthErrorMessage(error));
        setItems([]);
        setTotalCount(0);
        setTotalPages(1);
        setHasPreviousPage(false);
        setHasNextPage(false);
      } finally {
        setLoading(false);
      }
    },
    [applyWishlistPage],
  );

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const data = await getMyWishlist({
          pageNumber: 1,
          pageSize: PAGE_SIZE,
        });
        if (cancelled) return;
        applyWishlistPage(data, 1);
      } catch (error) {
        if (cancelled) return;
        notify.error(getAuthErrorMessage(error));
        setItems([]);
        setTotalCount(0);
        setTotalPages(1);
        setHasPreviousPage(false);
        setHasNextPage(false);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [applyWishlistPage]);

  const filteredFavorites = useMemo(() => {
    let result = [...items];

    if (search.trim() !== "") {
      const query = search.trim().toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.publicCode.toLowerCase().includes(query),
      );
    }

    if (sort === "price-low") {
      result.sort((a, b) => getDisplayPrice(a) - getDisplayPrice(b));
    } else if (sort === "price-high") {
      result.sort((a, b) => getDisplayPrice(b) - getDisplayPrice(a));
    } else if (sort === "oldest") {
      result.sort(
        (a, b) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime(),
      );
    } else {
      result.sort(
        (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
      );
    }

    return result;
  }, [items, sort, search]);

  const handleRemove = async (productId) => {
    if (!productId || removingId) return;

    setRemovingId(productId);
    try {
      await removeWishlistProduct(productId);
      setItems((prev) => prev.filter((item) => item.productId !== productId));
      setTotalCount((prev) => Math.max(0, prev - 1));
      notify.success("محصول از علاقه‌مندی‌ها حذف شد.");

      if (items.length === 1 && page > 1) {
        void loadWishlist(page - 1);
      }
    } catch (error) {
      notify.error(getAuthErrorMessage(error));
    } finally {
      setRemovingId(null);
    }
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;
    void loadWishlist(nextPage);
  };

  const from = totalCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, totalCount);

  return (
    <div className="lg:col-span-3 space-y-4">
      <UserFavoritesTop totalCount={totalCount} />

      <div className="bg-white rounded-2xl drop-shadow-lg px-3 py-2 dark:bg-custom-dark dark:border dark:border-gray-700">
        <FilterBar
          selects={[
            {
              key: "sort",
              value: sort,
              onChange: setSort,
              options: [
                { value: "recent", label: "جدیدترین" },
                { value: "oldest", label: "قدیمی‌ترین" },
                { value: "price-low", label: "قیمت (کم به زیاد)" },
                { value: "price-high", label: "قیمت (زیاد به کم)" },
              ],
            },
          ]}
          search={{
            value: search,
            onChange: setSearch,
            placeholder: "جستجوی نام یا کد محصول...",
          }}
        />
      </div>

      <div className="bg-white rounded-2xl drop-shadow-lg px-3 py-2 dark:bg-custom-dark dark:border dark:border-gray-700">
        <TitleAfter title={"لیست محصولات ذخیره شده"} />

        {loading ? (
          <FavoritesGridSkeleton />
        ) : filteredFavorites.length === 0 ? (
          <div className="mt-4">
            <UserProfileEmptyState
              title="محصولی در علاقه‌مندی‌ها نیست"
              description={
                search.trim()
                  ? "با این جستجو محصولی پیدا نشد."
                  : "محصولات مورد علاقه خود را از صفحه محصول اضافه کنید."
              }
              actionLabel={search.trim() ? undefined : "مشاهده محصولات"}
              actionHref="/products"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {filteredFavorites.map((item) => {
              const displayPrice = getDisplayPrice(item);
              const originalPrice = getOriginalPrice(item);
              const discount = getDiscountPercent(item);

              return (
                <FavoriteCard
                  key={item.wishlistItemId || item.productId}
                  title={item.name}
                  image={getProductImage(item.thumbnailPath ?? item.mediumPath)}
                  href={`/product/${item.publicCode}/${item.slug}`}
                  discount={discount ?? undefined}
                  price={formatPrice(displayPrice)}
                  originalPrice={
                    originalPrice ? formatPrice(originalPrice) : undefined
                  }
                  inStock={item.inStock}
                  hasPriceDropped={item.hasPriceDropped}
                  removing={removingId === item.productId}
                  onRemove={() => void handleRemove(item.productId)}
                />
              );
            })}
          </div>
        )}

        {!loading && totalCount > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 sm:mb-0">
              نمایش {new Intl.NumberFormat("fa-IR").format(from)} تا{" "}
              {new Intl.NumberFormat("fa-IR").format(to)} از{" "}
              {new Intl.NumberFormat("fa-IR").format(totalCount)} محصول
            </p>
            <div className="flex items-center space-x-2 ">
              <button
                type="button"
                disabled={!hasPreviousPage || loading}
                onClick={() => handlePageChange(page - 1)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                قبلی
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1)
                .slice(Math.max(0, page - 2), Math.max(0, page - 2) + 3)
                .map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => handlePageChange(pageNumber)}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg border ${
                      pageNumber === page
                        ? "text-white bg-primary border-primary hover:bg-primary/90 dark:bg-primary/80 dark:hover:bg-primary/60"
                        : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-zinc-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    }`}
                  >
                    {new Intl.NumberFormat("fa-IR").format(pageNumber)}
                  </button>
                ))}
              <button
                type="button"
                disabled={!hasNextPage || loading}
                onClick={() => handlePageChange(page + 1)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                بعدی
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
