"use client"

import { useRouter } from "next/navigation"
import { RestaurantSignIn } from "@/components/restaurant-panel-components/restaurant-signIn"

// Redirecting an already-authenticated visitor away from this page is handled
// at the edge by middleware.ts (via the cn_role cookie), so this page only
// needs to render the form for logged-out users.
const Page = () => {
  const router = useRouter()

  const handleLogin = () => {
    router.push("/restaurant-dashboard/settings")
  }

  return <RestaurantSignIn onLogin={handleLogin} />
}

export default Page
