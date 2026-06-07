import {
  HomeProduct,
  Product,
  ProductCardModel,
  ProductListItem,
} from "@/src/lib/types/productTypes";
import { ProductIndexData } from "@/src/lib/types/productTypes";
import { getProductImage } from "@/src/utils/product-image";

function toProduct(item: any): Product {
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
  product: HomeProduct | Product,
): ProductCardModel {
  if ("productId" in product) {
    return {
      id: product.productId,
      title: product.name,

      image: getProductImage(product.thumbnailPath ?? product.mediumPath),
      imageSlider: [],

      brandId: "",

      price: product.price,
      oldPrice: product.compareAtPrice ?? product.price,

      discount: product?.discountPercent,

      rating: product.averageRating ?? 0,
      reviewCount: product.reviewCount ?? 0,
      count: product.reviewCount ?? 0,

      colors: [],

      href: `/product/${product.slug}`,

      inStock: product.inStock,
      offer: false,
    };
  }

  return {
    id: product.id,
    title: product.title,

    image: product.image,
    imageSlider: product.imageSlider ?? [],

    brandId: product.brandId ?? "",

    price: product.price,
    oldPrice: product.oldPrice,

    discount: product.discount ?? "0",
    discountPercent: Number(product.discount ?? 0),

    rating: product.rating ?? 0,
    reviewCount: product.count ?? 0,
    count: product.count ?? 0,

    colors: product.colors ?? [],

    href: product.href,

    inStock: true,
    offer: product.offer ?? false,
  };
}
