"use client"

import React, { useState } from "react"
import UserSignIn from "@/components/customer-panel-components/user-signIn"
import Loader from "@/components/customer-panel-components/loader"

const Page = () => {
  const [loading, setLoading] = useState(false)

  // Wrapper to delay loader hiding
  const handleSetLoading = (val: boolean) => {
    if (val) {
      setLoading(true) // show loader immediately
    } else {
      // delay hiding loader by 1500ms (1.5s)
      setTimeout(() => setLoading(false), 2500)
    }
  }

  return (
    <>
      {loading && <Loader />}
      <UserSignIn setLoading={handleSetLoading} />
    </>
  )
}

export default Page
