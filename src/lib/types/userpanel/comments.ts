export type CommentStatus = "approved" | "pending";

export interface CommentItem {
  id: number;
  productImage: string;
  productTitle: string;
  rating: number; // 1–5
  status: CommentStatus;
  statusLabel: string; // برای نمایش فارسی
  statusColor: string; // رنگ پس‌زمینه و متن
  text: string;
  date: string;
  helpfulCount: number;
}

export type QuestionStatus = "answered" | "pending";

export interface QuestionItem {
  id: number;
  productImage: string;
  productTitle: string;
  productCode: string;
  questionText: string;
  questionDate: string;

  status: QuestionStatus;
  statusLabel: string;
  statusColor: string;

  // فقط اگر answered بود:
  answerText?: string;
  answerDateTime?: string; // Example: "۱۴۰۲/۱۰/۲۲ - ۱۴:۳۰"
}
