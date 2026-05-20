// src/lib/types/common/api-response.types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message: string
  timestamp: string
}
