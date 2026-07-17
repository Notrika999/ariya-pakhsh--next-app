"use client";

import { apiClient, ApiError } from "@/src/lib/http/api-client";
import type {
  CreateTicketRequest,
  CreateTicketResponse,
  SendTicketMessageRequest,
  TicketDetail,
  TicketListItem,
  TicketMessageItem,
  TicketsPage,
} from "@/src/lib/types/tickets/ticket.types";

function getRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function logApiError(label: string, error: unknown) {
 
  if (error instanceof ApiError) {
    console.error(`[ticket.client] ${label} error body =>`, {
      status: error.status,
      code: error.code,
      message: error.message,
      data: error.data,
    });
  }
}

function mapTicketListItem(value: unknown): TicketListItem {
  const record = getRecord(value);
  return {
    id: String(record.id ?? ""),
    ticketNumber: String(record.ticketNumber ?? ""),
    subject: String(record.subject ?? ""),
    category: String(record.category ?? ""),
    priority: String(record.priority ?? "low"),
    status: String(record.status ?? "open"),
    lastMessageAt: String(record.lastMessageAt ?? ""),
    createdAt: String(record.createdAt ?? ""),
    closedAt: record.closedAt ? String(record.closedAt) : null,
  };
}

function mapMessage(value: unknown): TicketMessageItem {
  const record = getRecord(value);
  return {
    id: String(record.id ?? ""),
    senderUserId: String(record.senderUserId ?? ""),
    senderDisplayName: String(record.senderDisplayName ?? "کاربر"),
    senderType: String(record.senderType ?? "customer"),
    body: String(record.body ?? ""),
    isInternalNote: Boolean(record.isInternalNote),
    createdAt: String(record.createdAt ?? ""),
  };
}

function unwrapTicketsPage(payload: unknown): TicketsPage {
  const root = getRecord(payload);
  const data = getRecord(root.data ?? root);
  const itemsRaw = Array.isArray(data.items)
    ? data.items
    : Array.isArray(root.items)
      ? root.items
      : [];

  const items = itemsRaw.map(mapTicketListItem);

  return {
    items,
    pageNumber: Number(data.pageNumber ?? root.pageNumber ?? 1),
    pageSize: Number(data.pageSize ?? root.pageSize ?? 10),
    totalCount: Number(data.totalCount ?? root.totalCount ?? items.length),
    totalPages: Number(data.totalPages ?? root.totalPages ?? 1),
    hasPreviousPage: Boolean(data.hasPreviousPage ?? root.hasPreviousPage),
    hasNextPage: Boolean(data.hasNextPage ?? root.hasNextPage),
  };
}

function unwrapTicketDetail(payload: unknown): TicketDetail {
  const root = getRecord(payload);
  const data = getRecord(root.data ?? root);
  const messagesRaw = Array.isArray(data.messages) ? data.messages : [];

  return {
    id: String(data.id ?? ""),
    ticketNumber: String(data.ticketNumber ?? ""),
    userId: String(data.userId ?? ""),
    orderId: data.orderId ? String(data.orderId) : null,
    orderNumber: data.orderNumber ? String(data.orderNumber) : null,
    subject: String(data.subject ?? ""),
    category: String(data.category ?? ""),
    priority: String(data.priority ?? "low"),
    status: String(data.status ?? "open"),
    assignedToUserId: data.assignedToUserId
      ? String(data.assignedToUserId)
      : null,
    assignedToDisplayName: data.assignedToDisplayName
      ? String(data.assignedToDisplayName)
      : null,
    lastMessageAt: String(data.lastMessageAt ?? ""),
    createdAt: String(data.createdAt ?? ""),
    closedAt: data.closedAt ? String(data.closedAt) : null,
    messages: messagesRaw
      .map(mapMessage)
      .filter((message) => !message.isInternalNote),
  };
}

export async function getMyTickets(params?: {
  page?: number;
  pageSize?: number;
}): Promise<TicketsPage> {
  const query = {
    page: params?.page ?? 1,
    pageSize: params?.pageSize ?? 20,
  };



  try {
    const response = await apiClient.get("/Tickets/my", { params: query });
    console.log("[ticket.client] getMyTickets response =>", response.data);
    return unwrapTicketsPage(response.data);
  } catch (error) {
    logApiError("getMyTickets", error);
    throw error;
  }
}

export async function getTicketById(ticketId: string): Promise<TicketDetail> {


  try {
    const response = await apiClient.get(`/Tickets/${ticketId}`);
    console.log("[ticket.client] getTicketById response =>", response.data);
    return unwrapTicketDetail(response.data);
  } catch (error) {
    logApiError("getTicketById", error);
    throw error;
  }
}

export async function createTicket(
  request: CreateTicketRequest,
): Promise<CreateTicketResponse> {
  const payload: Record<string, string> = {
    subject: request.subject?.trim() ?? "",
    category: request.category,
    body: request.body?.trim() ?? "",
    priority: request.priority,
  };

  const orderId = request.orderId?.trim();
  if (orderId) {
    payload.orderId = orderId;
  }

  if (!payload.subject || !payload.body) {
    throw new ApiError(400, "موضوع و متن تیکت الزامی است", "VALIDATION_ERROR");
  }



  try {
    const response = await apiClient.post("/Tickets", payload, {
      headers: { "Content-Type": "application/json" },
    });
 

    const root = getRecord(response.data);
    const data = getRecord(root.data ?? root);

    return {
      ticketId: String(data.ticketId ?? data.id ?? ""),
      ticketNumber: String(data.ticketNumber ?? ""),
    };
  } catch (error) {
    logApiError("createTicket", error);
    throw error;
  }
}

export async function sendTicketMessage(
  ticketId: string,
  body: SendTicketMessageRequest,
): Promise<unknown> {


  try {
    const response = await apiClient.post(
      `/Tickets/${ticketId}/messages`,
      body,
    );
   
    return response.data;
  } catch (error) {
    logApiError("sendTicketMessage", error);
    throw error;
  }
}

export async function closeTicket(ticketId: string): Promise<unknown> {
 

  try {
    const response = await apiClient.post(`/Tickets/${ticketId}/close`);
   
    return response.data;
  } catch (error) {
    logApiError("closeTicket", error);
    throw error;
  }
}
