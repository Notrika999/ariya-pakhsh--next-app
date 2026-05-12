import ActivityHistory from "../../../components/ui/UserProfile/ActivityHistory/ActivityHistory";
import React from "react";

function ActivityHistoryPage() {
  return <ActivityHistory />;
}

export default ActivityHistoryPage;


// NOINDEX 
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};