// app/user-profile/tickets/[id]/page.jsx
import Tickets from "@/components/ui/UserProfile/Tickets/Tickets";
import { TicketDetailsSkeleton } from "@/components/ui/UserProfile/skeletons/UserProfileSkeletons";
import { Suspense } from "react";

export default async function TicketDetailsPage({ params }) {
  const { id } = await params;
  return (
    <Suspense fallback={<TicketDetailsSkeleton />}>
      <Tickets initialTicketId={id} />
    </Suspense>
  );
}

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};
