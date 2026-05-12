import Comments from "@/components/ui/UserProfile/Comments/Comments";
import React from "react";

function CommentsPage() {
  return <Comments />;
}

export default CommentsPage;

// NOINDEX 
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};