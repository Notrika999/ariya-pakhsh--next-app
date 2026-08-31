import Tickets from "@/components/ui/UserProfile/Tickets/Tickets";
import { TicketsPageSkeleton } from "@/components/ui/UserProfile/skeletons/UserProfileSkeletons";
import React, { Suspense } from "react";

function TicketsPage() {
  return (
    <Suspense fallback={<TicketsPageSkeleton />}>
      <Tickets />
    </Suspense>
  );
}

export default TicketsPage;

// NOINDEX 
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};