import { Product } from "@/src/lib/types/productTypes";
import { ProductIndexData } from "@/src/lib/types/productTypes";

function toProduct(item: any): Product {
  return {
    id: item.productId,
    title: item.name,
    image:
      item.mediumPath ||
      item.thumbnailPath ||
      "/images/default.png",

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
        : "0",

    rating: item.averageRating ?? 0,
    count: item.reviewCount ?? 0,

    colors: [],
    href: `/product/${item.slug}`,

    offer: item.isOnSale,
    dealEndsAt: undefined,
  };
}

export function mapProductIndex(data: ProductIndexData) {
  const featuredProducts = data.featuredProducts.map(toProduct);
  const newestProducts = data.newestProducts.map(toProduct);
  const bestSellingProducts = data.bestSellingProducts.map(toProduct);
  const onSaleProducts = data.onSaleProducts.map(toProduct);

  const merge = [...featuredProducts, ...newestProducts, ...bestSellingProducts];

  return {
    featuredProducts,
    newestProducts,
    bestSellingProducts,
    onSaleProducts,
    products: Array.from(
      new Map(merge.map((p) => [p.id, p])).values(),
    ),
  };
}