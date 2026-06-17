"use client"

import RiderSignup from '@/components/rider-panel-components/rider-signup'

// Redirecting an already-authenticated visitor away from this page is handled
// at the edge by middleware.ts (via the cn_role cookie).
const page = () => {
  return <RiderSignup />
}

export default page
