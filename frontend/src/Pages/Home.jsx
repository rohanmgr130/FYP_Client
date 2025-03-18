import React from 'react'
import Nav from '../components/Nav'
import Search from '../components/Home/Search'
import Category from '../components/Home/Category'
import TodaysSpecial from '../components/Home/TodaysSpecial'
import Footer from '../components/FooterPart'
import OurMenu from '../components/Home/OurMenu'




const Home = () => {
  return (
    <>
      <Nav/>

      <Search/>
      <Category/>
      <TodaysSpecial/>
      <OurMenu/>
      
      <Footer/>
    </>
  )
}

export default Home