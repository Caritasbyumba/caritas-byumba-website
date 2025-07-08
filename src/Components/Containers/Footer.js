import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { CardBody, CardTitle } from '../text';
import { TextButton } from '../UI/button';
import { MdPlace, MdEmail, MdLocalPhone } from 'react-icons/md';
import { BsMailbox2 } from 'react-icons/bs';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { IoEarth } from 'react-icons/io5';

const Footer = () => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <div className="bg-gray-200">
      <div className="flex flex-col lg:flex-row justify-between divide-y divide-gray-500 lg:divide-y-0">
        <div className="lg:w-1/3 grid place-items-center">
          <Link to="/" className="p-5 grid place-items-center">
            <img
              className="w-1/2 md:w-full object-cover object-center"
              src="/images/logo.png"
              alt=""
              loading="lazy"
            />
          </Link>
        </div>
        <div className="lg:w-1/3 flex flex-col p-5 mx-0 md:mx-auto">
          <CardTitle name={t('EXPLORE MORE')} color="red" />
          <TextButton
            name={t('Who we are')}
            color="red"
            additional="hover:underline h-fit text-left"
            onClick={() => history.push(`/aboutus`)}
          />
          <TextButton
            name={t('Donate')}
            color="red"
            additional="hover:underline h-fit text-left font-bold"
            onClick={() => history.push(`/donate`)}
          />
          <TextButton
            name={t('Projects')}
            color="red"
            additional="hover:underline h-fit text-left"
            onClick={() => history.push(`/projects`)}
          />
          <TextButton
            name={t('Publications')}
            color="red"
            additional="hover:underline h-fit text-left"
            onClick={() => history.push(`publications`)}
          />
          <TextButton
            name={t('Contact Us')}
            color="red"
            additional="hover:underline h-fit text-left"
            onClick={() => history.push(`contactus`)}
          />
          <TextButton
            name={t('Log In')}
            color="red"
            additional="hover:underline h-fit text-left"
            onClick={() => history.push(`login`)}
          />
        </div>
        <div className="lg:w-1/3 flex flex-col p-5 mx-0 md:mx-auto">
          <CardTitle name={t('ADDRESS & CONTACTS')} />
          <Link
            to={{ pathname: 'https://goo.gl/maps/LGcs8U8Znr9UG4mr9' }}
            target="_blank"
            className="flex space-x-2 items-center hover:underline"
          >
            <MdPlace />
            <CardBody name="Byumba, Gicumbi; Rwanda" />
          </Link>
          <div className="flex space-x-2 items-center">
            <BsMailbox2 />
            <CardBody name="PO Box: 05 Byumba - Rwanda" />
          </div>
          <Link
            to={{ pathname: 'tel:+250787605413' }}
            target="_blank"
            className="flex space-x-2 items-center hover:underline"
          >
            <MdLocalPhone />
            <CardBody name="Tel: +250787605413" />
          </Link>
          <Link
            to={{ pathname: 'mailto:caritasbyumba@yahoo.fr' }}
            target="_blank"
            className="flex space-x-2 items-center hover:underline"
          >
            <MdEmail />
            <CardBody name="caritasbyumba@yahoo.fr" />
          </Link>
          <Link
            to={{ pathname: 'mailto:caritasbyumba81@gmail.com' }}
            target="_blank"
            className="flex space-x-2 items-center hover:underline"
          >
            <MdEmail />
            <CardBody name="caritasbyumba81@gmail.com" />
          </Link>
          <Link
            to={{ pathname: 'https://caritasbyumba.org/aboutus' }}
            target="_blank"
            className="flex space-x-2 items-center hover:underline"
          >
            <IoEarth />
            <CardBody name="www.caritasbyumba.org" />
          </Link>
          <div className="flex space-x-2 mt-3">
            <Link
              to={{ pathname: 'https://twitter.com/CByumba' }}
              target="_blank"
              className="p-1 border border-twitter rounded-full"
            >
              <FaTwitter color="#00acee" />
            </Link>
            <Link
              to={{
                pathname: 'https://www.instagram.com/caritas_byumba/',
              }}
              target="_blank"
              className="p-1 box-border rounded-full bg-gradient-to-tr from-instagram-yellow via-instagram-pink to-instagram-purple"
            >
              <FaInstagram color="white" />
            </Link>
            <Link
              to={{
                pathname:
                  'https://www.youtube.com/watch?v=fBKN6ZuzCN4https://www.youtube.com/watch?v=fBKN6ZuzCN4',
              }}
              target="_blank"
              className="p-1 border border-youtube-red rounded-full"
            >
              <FaYoutube color="#FF0000" />
            </Link>
            <Link
              to={{
                pathname:
                  'https://www.facebook.com/profile.php?id=100081838735786&_rdc=2&_rdr',
              }}
              target="_blank"
              className="p-1 border border-facebook-blue rounded-full"
            >
              <FaFacebookF color="#4267B2" />
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-gray-500 h-12 flex justify-center items-center  space-x-2">
        <CardBody
          name={`© Copyright 2022. `}
          color="red"
          additional="font-bold"
        />
        <CardBody name={t('All rights reserved.')} color="red" />
      </div>
    </div>
  );
};

export default Footer;
