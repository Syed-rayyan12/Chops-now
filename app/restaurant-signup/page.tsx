"use client"

import RestaurantSignup from '@/components/restaurant-panel-components/restaurant-signup'

// Redirecting an already-authenticated visitor away from this page is handled
// at the edge by middleware.ts (via the cn_role cookie).
const Page = () => {
  return <RestaurantSignup />
}

export default Page
