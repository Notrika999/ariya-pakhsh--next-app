"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import TicketMessage from "./TicketMessage";
import TicketList from "./TicketList";
import {
  createTicket,
  getMyTickets,
} from "@/src/services/ticket/ticket.client";
import { getAuthErrorMessage } from "@/src/services/auth/auth.client";
import { notify } from "@/src/utils/toast";

const PAGE_SIZE = 20;

export default function Tickets({ initialTicketId = null }) {
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(initialTicketId);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    category: "",
    search: "",
  });

  const loadTickets = useCallback(async (pageNumber = 1, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    setError(null);

    try {
      const result = await getMyTickets({
        page: pageNumber,
        pageSize: PAGE_SIZE,
      });

      setTickets((prev) =>
        append ? [...prev, ...result.items] : result.items,
      );
      setPage(result.pageNumber || pageNumber);
      setTotalCount(result.totalCount);
      setHasNextPage(
        result.hasNextPage || result.pageNumber < result.totalPages,
      );
    } catch (err) {
      console.error("[Tickets] loadTickets failed =>", err);
      setError(getAuthErrorMessage(err));
      if (!append) setTickets([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    void loadTickets(1, false);
  }, [loadTickets]);

  useEffect(() => {
    setSelectedTicketId(initialTicketId);
  }, [initialTicketId]);

  const handleFilterChange = (updatedFilter) => {
    setFilters((prev) => ({ ...prev, ...updatedFilter }));
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const statusMatch = filters.status
        ? ticket.status === filters.status
        : true;
      const priorityMatch = filters.priority
        ? ticket.priority === filters.priority
        : true;
      const categoryMatch = filters.category
        ? ticket.category === filters.category
        : true;
      const search = filters.search.trim().toLowerCase();
      const searchMatch = search
        ? ticket.subject.toLowerCase().includes(search) ||
          ticket.ticketNumber.toLowerCase().includes(search) ||
          ticket.id.toLowerCase().includes(search)
        : true;

      return statusMatch && priorityMatch && categoryMatch && searchMatch;
    });
  }, [tickets, filters]);

  const handleCreateTicket = async (payload) => {
    setCreating(true);
    try {
      const result = await createTicket(payload);
      notify.success(
        result.ticketNumber
          ? `تیکت ${result.ticketNumber} ایجاد شد`
          : "تیکت با موفقیت ایجاد شد",
      );
      await loadTickets(1, false);
      if (result.ticketId) {
        setSelectedTicketId(result.ticketId);
      }
      return true;
    } catch (err) {
      console.error("[Tickets] createTicket failed =>", err);
      notify.error(getAuthErrorMessage(err));
      return false;
    } finally {
      setCreating(false);
    }
  };

  if (selectedTicketId) {
    return (
      <TicketMessage
        ticketId={selectedTicketId}
        onBack={() => {
          setSelectedTicketId(null);
          void loadTickets(1, false);
        }}
      />
    );
  }

  return (
    <TicketList
      tickets={filteredTickets}
      totalCount={totalCount}
      loading={loading}
      loadingMore={loadingMore}
      hasNextPage={hasNextPage}
      error={error}
      creating={creating}
      onView={setSelectedTicketId}
      onLoadMore={() => loadTickets(page + 1, true)}
      onCreate={handleCreateTicket}
      filters={filters}
      onFilterChange={handleFilterChange}
    />
  );
}
