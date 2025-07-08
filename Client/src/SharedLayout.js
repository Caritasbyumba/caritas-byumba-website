import React from 'react';
import Header from '../Components/Containers/Header';
import Footer from '../Components/Containers/Footer';

function SharedLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default SharedLayout;