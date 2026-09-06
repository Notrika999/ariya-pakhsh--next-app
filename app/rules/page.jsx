import Rules from '@/components/ui/Rules/Rules'
import { absoluteUrl } from "@/src/lib/seo/site";
import React from 'react'

export const metadata = {
  alternates: {
    canonical: absoluteUrl("/rules"),
  },
};

function RulesPage() {
  return (
   <Rules />
  )
}

export default RulesPage
