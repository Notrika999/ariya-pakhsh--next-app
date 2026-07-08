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
  // console.log("Product Mapper normalizeProduct => ", product);
  if (isProductListItem(product)) {
    return {
      id: product.productId,
      title: product.name,
      publicCode: product.publicCode,

      image: getProductImage(product.thumbnailPath ?? product.mediumPath),
      imageSlider: [],

      brandId: "",
      primaryBrandName: product.primaryBrandName,
      primaryBrandSlug: product.primaryBrandSlug,

      categoryName: product.primaryCategoryName ?? "",

      currency: product.currencyCode,
      oldPrice: product.compareAtPrice ?? product.price,
      price: product.price,

      rating: product.averageRating ?? 0,
      reviewCount: product.reviewCount ?? 0,

      colors: [],

      href: `/product/${product.publicCode}/${product.slug}`,

      inStock: product.inStock,
      isOnSale: product.isOnSale,
      offer: false,
      quantity: product.availableQuantity,
      soldCount: product.soldCount,
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

    inStock: 'inStock' in product ? Boolean(product.inStock) : undefined,
    isOnSale: Number(product.discount ?? 0) > 0,
    offer: product.offer ?? false,
  };
}
