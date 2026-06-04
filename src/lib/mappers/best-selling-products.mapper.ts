import { Product } from "@/src/lib/types/productTypes";

type bestSellingProducts = {
  id: number;
  products: {
    id: string | number;
    title: string;
    image: string;
    href: string;
  }[];
};

export function mapToBestSellingProducts(
  products: Product[],
  chunkSize = 3,
): bestSellingProducts[] {
  const chunks: bestSellingProducts[] = [];

  for (let i = 0; i < products.length; i += chunkSize) {
    const chunk = products.slice(i, i + chunkSize);

    chunks.push({
      id: i / chunkSize + 1,
      products: chunk.map((p) => ({
        id: p.id,
        title: p.title,
        image: p.image,
        href: p.href,
      })),
    });
  }

  return chunks;
}