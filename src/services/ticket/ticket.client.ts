"use client";
// src/services/ticket/ticket.client.ts
import { apiClient, ApiError } from "@/src/lib/http/api-client";
import type {
  CreateTicketRequest,
  CreateTicketResponse,
  SendTicketMessageRequest,
  TicketAttachment,
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

function isFile(value: unknown): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

function createTicketFormData(
  payload: Record<string, string>,
  attachmentFiles: File[],
) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, value);
  });

  attachmentFiles.forEach((file) => {
    formData.append("AttachmentFiles", file, file.name);
  });

  return formData;
}

function normalizeTicketCategory(category: string): string {
  const value = category?.trim() ?? "";
  if (value === "cancel") return "cancell";
  return value;
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

function mapAttachment(value: unknown): TicketAttachment {
  const record = getRecord(value);
  return {
    id: String(record.id ?? ""),
    messageId: String(record.messageId ?? ""),
    mediaId: String(record.mediaId ?? ""),
    fileName: String(record.fileName ?? ""),
    url: String(record.url ?? ""),
    contentType: String(record.contentType ?? ""),
    fileSizeBytes: Number(record.fileSizeBytes ?? 0),
    createdAt: String(record.createdAt ?? ""),
  };
}

function mapMessage(value: unknown): TicketMessageItem {
  const record = getRecord(value);
  const attachmentsRaw = Array.isArray(record.attachments)
    ? record.attachments
    : [];

  return {
    id: String(record.id ?? ""),
    senderUserId: String(record.senderUserId ?? ""),
    senderDisplayName: String(record.senderDisplayName ?? "کاربر"),
    senderType: String(record.senderType ?? "customer"),
    body: String(record.body ?? ""),
    isInternalNote: Boolean(record.isInternalNote),
    createdAt: String(record.createdAt ?? ""),
    attachments: attachmentsRaw.map(mapAttachment).filter((item) => item.url),
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
  const attachmentsRaw = Array.isArray(data.attachments) ? data.attachments : [];

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
    attachments: attachmentsRaw.map(mapAttachment).filter((item) => item.url),
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
    return unwrapTicketsPage(response.data);
  } catch (error) {
    logApiError("getMyTickets", error);
    throw error;
  }
}

export async function getTicketById(ticketId: string): Promise<TicketDetail> {


  try {
    const response = await apiClient.get(`/Tickets/${ticketId}`);
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
    category: normalizeTicketCategory(request.category),
    body: request.body?.trim() ?? "",
    priority: request.priority,
    orderId: request.orderId?.trim() ?? "",
    orderNumber: request.orderNumber?.trim() ?? "",
  };

  if (!payload.subject || !payload.body) {
    throw new ApiError(400, "موضوع و متن تیکت الزامی است", "VALIDATION_ERROR");
  }



  const attachmentFiles = (request.attachmentFiles ?? []).filter(isFile);

  try {
    const response = await apiClient.post(
      "/Tickets",
      createTicketFormData(payload, attachmentFiles),
    );

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
