export interface BrandImage {
  logoSmUrl: string
  logoMdUrl: string
  logoLgUrl: string
}

export interface Brand {
  id: string
  name: string
  slug: string
  productCount: number
  isLeaf: boolean
  isFeatured: boolean
  firstLetter: string
  image: BrandImage
}

export interface PaginatedResponse<T> {
  items: T[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface GetBrandsParams {
  pageNumber?: number;
  pageSize?: number;
  letter?: string;
  grouped?: boolean;
  search?: string;
  isFeatured?: boolean;
}
