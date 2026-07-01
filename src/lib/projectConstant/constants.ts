export interface ApiResponse {
  success: boolean
  message?: string
  code?: string
  traceId?: string
  errors?: ValidationError[]
}

export interface ApiResponseWithData<T> extends ApiResponse {
  data?: T
}

export interface PaginatedApiResponse<T> extends ApiResponse {
  data?: T[]
  pagination: PaginationMeta
}

export interface PaginationMeta {
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface ListParams {
  pageNumber?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
  [key: string]: unknown
}

export interface ValidationError {
  field: string
  message: string
  code?: string
}
