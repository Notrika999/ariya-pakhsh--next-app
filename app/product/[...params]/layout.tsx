import type { ReactNode } from "react";
import { getProductIdentifier, loadProduct } from "./load-product";
import {
  getRequestSearchParams,
  redirectLegacyProductPath,
} from "./product-url";

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
  const product = await loadProduct(getProductIdentifier(params));
  redirectLegacyProductPath(params, product, await getRequestSearchParams());
  return children;
}
