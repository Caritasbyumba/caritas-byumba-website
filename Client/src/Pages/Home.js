import React from 'react';
import Footer from '../Components/Containers/Footer';
import Header from '../Components/Containers/Header';
import Carousel from '../Components/Containers/Home/Carousel';
import MainProjects from '../Components/Containers/Home/MainProjects';
import Moreonus from '../Components/Containers/Home/Moreonus';
import Partners from '../Components/Containers/Home/Partners';
import { Helmet } from 'react-helmet';

const Home = (props) => {
  return (
    <div>
      <Helmet>
        <title>CARITAS BYUMBA</title>
      </Helmet>
      <Header />
      <Carousel />
      <Moreonus />
      <MainProjects />
      <Partners />
      <Footer />
    </div>
  );
};

export default Home;
