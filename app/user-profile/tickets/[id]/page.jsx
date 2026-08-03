// app/user-profile/tickets/[id]/page.jsx
import Tickets from "@/components/ui/UserProfile/Tickets/Tickets";

export default async function TicketDetailsPage({ params }) {
  const { id } = await params;
  return <Tickets initialTicketId={id} />;
}

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};
