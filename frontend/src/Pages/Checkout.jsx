import React from 'react'
import MyOrder from '../components/Order/MyOrder'
import Navbar from '../components/Navbar'
import Footer from '../components/FooterPart'

const Checkout = () => {
  return (
    <>
      <Navbar/>
      <MyOrder />
      <Footer/>
    </>
  )
}

export default Checkout