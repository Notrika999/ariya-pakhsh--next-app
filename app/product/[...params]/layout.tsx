import type { ReactNode } from "react";
import { getProductIdentifier, loadProduct } from "./load-product";

type ProductLayoutProps = {
  children: ReactNode;
  params: Promise<{
    params: string[];
  }>;
};

export default async function ProductLayout({
  children,
  params: pageParams,
}: ProductLayoutProps) {
  const { params } = await pageParams;
  await loadProduct(getProductIdentifier(params));
  return children;
}
