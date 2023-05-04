import React from 'react';
import HeroSection from '../../HeroSection';
import Navbar from '../../Navbar/Navbar';
import Footer from '../Footer.js/Footer';
import { homeObjOne, homeObjFour } from './Data';
import firebase from '../../../firbase'
import GlobalEvents from './GlobalEvents';
import { useAuth } from '../../Auth/AuthContext';

function Home() {
  const {currentUser} = useAuth();
  
  return (
    <>
      <Navbar/>
      <HeroSection {...homeObjOne} />
      <HeroSection {...homeObjFour} />
      {currentUser !== null ? <GlobalEvents /> : <></>}
      <Footer/>
    </>
  );
}

export default Home;
