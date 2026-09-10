import Rules from '@/components/ui/Rules/Rules'
import { buildCanonical } from "@/src/lib/seo/canonical";
import React from 'react'

export const metadata = {
  alternates: {
    canonical: buildCanonical("/rules"),
  },
};

function RulesPage() {
  return (
   <Rules />
  )
}

export default RulesPage
