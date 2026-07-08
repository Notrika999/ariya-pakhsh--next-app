export type TicketCategory =
  | "orderTracking"
  | "payment"
  | "product"
  | "technical"
  | "sales"
  | "general"
  | string;

export type TicketPriority = "low" | "medium" | "high" | "urgent" | string;

export type TicketStatus = "open" | "pending" | "answered" | "closed" | string;

export type TicketSenderType = "customer" | "agent" | "system" | string;

export type TicketListItem = {
  id: string;
  ticketNumber: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  lastMessageAt: string;
  createdAt: string;
  closedAt: string | null;
};

export type TicketMessageItem = {
  id: string;
  senderUserId: string;
  senderDisplayName: string;
  senderType: TicketSenderType;
  body: string;
  isInternalNote: boolean;
  createdAt: string;
};

export type TicketDetail = {
  id: string;
  ticketNumber: string;
  userId: string;
  orderId: string | null;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assignedToUserId: string | null;
  assignedToDisplayName: string | null;
  lastMessageAt: string;
  createdAt: string;
  closedAt: string | null;
  messages: TicketMessageItem[];
};

export type TicketsPage = {
  items: TicketListItem[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type CreateTicketRequest = {
  subject: string;
  category: TicketCategory;
  body: string;
  priority: TicketPriority;
  orderId?: string | null;
};

export type CreateTicketResponse = {
  ticketId: string;
  ticketNumber: string;
};

export type SendTicketMessageRequest = {
  body: string;
};
