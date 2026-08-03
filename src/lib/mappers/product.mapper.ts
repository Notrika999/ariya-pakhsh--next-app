import {
  HomeProduct,
  Product,
  ProductCardModel,
  ProductListItem,
} from "@/src/lib/types/productTypes";
import { ProductIndexData } from "@/src/lib/types/productTypes";
import { getProductImage } from "@/src/utils/product-image";

function isProductListItem(
  product: Product | ProductListItem | HomeProduct,
): product is ProductListItem {
  return "productId" in product;
}

function getStringField(
  value: unknown,
  keys: string[],
): string | undefined {
  if (!value || typeof value !== "object") return undefined;

  const record = value as Record<string, unknown>;
  for (const key of keys) {
    const fieldValue = record[key];
    if (typeof fieldValue === "string" && fieldValue.trim()) {
      return fieldValue.trim();
    }
  }

  return undefined;
}

function getNumberField(
  value: unknown,
  keys: string[],
): number | undefined {
  if (!value || typeof value !== "object") return undefined;

  const record = value as Record<string, unknown>;
  for (const key of keys) {
    const fieldValue = record[key];
    const parsed = Number(fieldValue);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return undefined;
}

function getRecordField(
  value: unknown,
  key: string,
): Record<string, unknown> | undefined {
  if (!value || typeof value !== "object") return undefined;

  const fieldValue = (value as Record<string, unknown>)[key];
  return fieldValue && typeof fieldValue === "object" && !Array.isArray(fieldValue)
    ? (fieldValue as Record<string, unknown>)
    : undefined;
}

function getFirstRecordFromArrayField(
  value: unknown,
  key: string,
): Record<string, unknown> | undefined {
  if (!value || typeof value !== "object") return undefined;

  const fieldValue = (value as Record<string, unknown>)[key];
  return Array.isArray(fieldValue) &&
    fieldValue[0] &&
    typeof fieldValue[0] === "object"
    ? (fieldValue[0] as Record<string, unknown>)
    : undefined;
}

function getProductVariantId(product: unknown): string | undefined {
  const directVariantId = getStringField(product, [
    "variantId",
    "VariantId",
    "variantID",
    "VariantID",
    "defaultVariantId",
    "DefaultVariantId",
    "defaultVariantID",
    "DefaultVariantID",
  ]);

  if (directVariantId) return directVariantId;

  if (!product || typeof product !== "object") return undefined;

  const variants = (product as Record<string, unknown>).variants;
  if (!Array.isArray(variants) || variants.length === 0) return undefined;

  return getStringField(variants[0], [
    "variantId",
    "VariantId",
    "variantID",
    "VariantID",
  ]);
}

function getProductListVariantRecord(product: ProductListItem) {
  return (
    getRecordField(product, "defaultVariant") ??
    getRecordField(product, "variant") ??
    getFirstRecordFromArrayField(product, "variants")
  );
}

function getProductListPricing(product: ProductListItem) {
  const variant = getProductListVariantRecord(product);
  const promotion = getRecordField(product, "promotion");
  const finalPrice =
    product.salePrice ??
    product.finalPrice ??
    getNumberField(variant, ["salePrice", "finalPrice"]) ??
    getNumberField(promotion, ["finalPrice"]);
  const price = finalPrice && finalPrice > 0 ? finalPrice : product.price;
  const promotionBasePrice = getNumberField(promotion, ["basePrice"]);
  const variantCompareAtPrice = getNumberField(variant, [
    "compareAtPrice",
    "basePrice",
    "originalPrice",
  ]);
  const oldPrice =
    product.compareAtPrice && product.compareAtPrice > price
      ? product.compareAtPrice
      : product.originalPrice && product.originalPrice > price
        ? product.originalPrice
        : product.basePrice && product.basePrice > price
          ? product.basePrice
          : variantCompareAtPrice && variantCompareAtPrice > price
            ? variantCompareAtPrice
            : promotionBasePrice && promotionBasePrice > price
              ? promotionBasePrice
              : product.compareAtPrice ?? product.price;
  const explicitDiscount =
    product.discountPercent && product.discountPercent > 0
      ? product.discountPercent
      : getNumberField(variant, ["discountPercent"]) ??
        getNumberField(promotion, ["discountPercent"]);
  const discountPercent =
    explicitDiscount && explicitDiscount > 0
      ? Math.round(explicitDiscount)
      : oldPrice > price && price > 0
        ? Math.round(((oldPrice - price) / oldPrice) * 100)
        : 0;

  return {
    price,
    oldPrice,
    discountPercent,
    isOnSale: Boolean(product.isOnSale) || discountPercent > 0 || oldPrice > price,
  };
}

function getProductListSaleBadge(product: ProductListItem) {
  const variant = getProductListVariantRecord(product);
  const promotion = getRecordField(product, "promotion");
  const label =
    getStringField(product, [
      "campaignLabel",
      "campaignTitle",
      "campaignName",
      "promotionLabel",
      "promotionTitle",
      "promotionTypeDisplayName",
      "typeLabel",
    ]) ??
    getStringField(variant, [
      "campaignLabel",
      "campaignTitle",
      "campaignName",
      "promotionLabel",
      "promotionTitle",
      "promotionTypeDisplayName",
      "typeLabel",
    ]) ??
    getStringField(promotion, [
      "promotionTypeDisplayName",
      "typeLabel",
      "campaignLabel",
      "campaignTitle",
      "campaignName",
    ]);

  if (!label) return undefined;

  return {
    label,
    promotionType:
      getNumberField(product, ["promotionType"]) ??
      getNumberField(variant, ["promotionType"]) ??
      getNumberField(promotion, ["promotionType"]),
    promotionTypeValue:
      getStringField(product, ["promotionTypeValue"]) ??
      getStringField(variant, ["promotionTypeValue"]) ??
      getStringField(promotion, ["promotionTypeValue"]),
    discountPercent: getProductListPricing(product).discountPercent,
    endsAt:
      getStringField(product, ["campaignEndAt", "promotionEndAt"]) ??
      getStringField(variant, ["campaignEndAt", "promotionEndAt"]) ??
      getStringField(promotion, ["promotionEndAt", "campaignEndAt"]),
    remainingSeconds:
      getNumberField(product, ["campaignRemainingSeconds", "remainingSeconds"]) ??
      getNumberField(variant, ["campaignRemainingSeconds", "remainingSeconds"]) ??
      getNumberField(promotion, ["remainingSeconds", "campaignRemainingSeconds"]),
  };
}

function toProduct(item: Product | ProductListItem): Product {
  if (!isProductListItem(item)) {
    return item;
  }

  return {
    id: item.productId,
    title: item.name,

    image: getProductImage(item.thumbnailPath ?? item.mediumPath),

    imageSlider: [],

    brandId: "",

    price: item.price,
    oldPrice: item.compareAtPrice ?? item.price,

    discount:
      item.compareAtPrice && item.price
        ? String(
            Math.round(
              ((item.compareAtPrice - item.price) / item.compareAtPrice) * 100,
            ),
          )
        : null,

    rating: item.averageRating ?? 0,
    count: item.reviewCount ?? 0,

    colors: [],
    href: `/product/${item.publicCode}/${item.slug}`,

    inStock: item.inStock,
    offer: item.isOnSale,
    dealEndsAt: undefined,
  };
}

export function mapProductIndex(data: ProductIndexData) {
  const featuredProducts = data.featuredProducts.map(toProduct);
  const newestProducts = data.newestProducts.map(toProduct);
  const bestSellingProducts = data.bestSellingProducts.map(toProduct);
  const onSaleProducts = data.onSaleProducts.map(toProduct);

  const merge = [
    ...featuredProducts,
    ...newestProducts,
    ...bestSellingProducts,
  ];

  return {
    featuredProducts,
    newestProducts,
    bestSellingProducts,
    onSaleProducts,
    products: Array.from(new Map(merge.map((p) => [p.id, p])).values()),
  };
}

export function normalizeProduct(
  product: HomeProduct | Product | ProductListItem,
): ProductCardModel {
 
  if (isProductListItem(product)) {
    const variantId = getProductVariantId(product);
    const pricing = getProductListPricing(product);
    const saleBadge = getProductListSaleBadge(product);

    return {
      id: product.productId,
      title: product.name,
      slug: product.slug,
      publicCode: product.publicCode,

      image: getProductImage(product.thumbnailPath ?? product.mediumPath),
      imageSlider: [],

      brandId: "",
      primaryBrandName: product.primaryBrandName,
      primaryBrandSlug: product.primaryBrandSlug,

      categoryName: product.primaryCategoryName ?? "",

      currency: product.currencyCode,
      oldPrice: pricing.oldPrice,
      originalPrice: pricing.oldPrice,
      discountedPrice: pricing.price,
      price: pricing.price,
      discountPercent: pricing.discountPercent,

      rating: product.averageRating ?? 0,
      reviewCount: product.reviewCount ?? 0,

      colors: [],

      href: `/product/${product.publicCode}/${product.slug}`,

      inStock: product.inStock,
      isOnSale: pricing.isOnSale,
      showSaleBadge: saleBadge,
      specialSale: Boolean(saleBadge || product.isAmazingOffer),
      offer: pricing.isOnSale,
      quantity: product.availableQuantity,
      soldCount: product.soldCount,
      variantId: variantId ?? getStringField(product.promotion, ["variantId"]),
      ...(saleBadge?.endsAt ? { dealEndsAt: saleBadge.endsAt } : {}),
    };
  }

  return {
    id: String(product.id),
    title: product.title,

    image: product.image,
    imageSlider: "imageSlider" in product ? product.imageSlider : [],

    brandId: "brandId" in product ? product.brandId : "",
    categoryName: "",
    currency: "IRR",

    price: product.price,
    oldPrice: product.oldPrice,
    originalPrice: product.oldPrice,
    discountedPrice: product.price,

    discountPercent: Number(product.discount ?? 0),

    rating: product.rating ?? 0,
    count: product.count ?? 0,
    reviewCount: product.count ?? 0,

    colors: "colors" in product ? product.colors : [],
    quantity: 1,
    soldCount: 0,

    href: product.href,

    inStock: "inStock" in product ? Boolean(product.inStock) : undefined,
    isOnSale: Number(product.discount ?? 0) > 0,
    offer: product.offer ?? false,
    variantId: getProductVariantId(product),
  };
}
