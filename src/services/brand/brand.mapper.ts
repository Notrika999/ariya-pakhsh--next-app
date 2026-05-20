import { Brand } from "@/src/lib/types/brand/brand.types"


export interface BrandEntity {
  id: string
  title: string
  slug: string
  logo: string
  productCount: number
}

export function mapBrand(apiBrand: Brand): BrandEntity {
  return {
    id: apiBrand.id,
    title: apiBrand.name,
    slug: apiBrand.slug,
    logo: apiBrand.image?.logoMdUrl ?? "",
    productCount: apiBrand.productCount,
  }
}
