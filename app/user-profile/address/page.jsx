import UsersAddress from '@/components/ui/UserProfile/UserAddress/UserAddress'
import React from 'react'

function AddressPage() {
  return (
    <UsersAddress />
  )
}

export default AddressPage

// NOINDEX 
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};