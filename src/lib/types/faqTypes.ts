export interface FaqItem {
  id: number;
  content: string;
}

export interface Faq {
  id: number;
  category: string;
  title: string;
  subTitle: string;
  items: FaqItem[];
  details: string;
}

export interface FaqTab {
  id: string;
  title: string;
}

export interface FaqResponse {
  tabs: FaqTab[];
  faqs: Faq[];
}

export interface ApiError {
  error: true;
  message: string;
}
// 
export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message: string;
  timestamp: string;
};
