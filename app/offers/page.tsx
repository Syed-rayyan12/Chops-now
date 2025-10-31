import { RestaurantRiderNavbar } from '@/components/customer-panel-components/admin-rider-navbar'
import { Footer } from '@/components/customer-panel-components/footer'
import { Header } from '@/components/customer-panel-components/header'
import { OffersPage } from '@/components/customer-panel-components/offers-page'
import React from 'react'

const page = () => {
  return (
    <>
    <div>

       {/* <RestaurantRiderNavbar/> */}
       <Header/>
       
       <main>
       <OffersPage/>
       </main>
       <Footer/>
    </div>

    </>
  )
}

export default page
