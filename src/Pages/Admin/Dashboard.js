import React from 'react';
import Footer from '../../components/containers/Footer';
import Header from '../../components/containers/Header';
import { SectionTitle } from '../../components/text';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const Dashboard = (props) => {
  const { t } = useTranslation();
  const pages = [
    { name: 'Home', path: '/dashboard/home' },
    { name: 'About us', path: '/dashboard/aboutus' },
    { name: 'Donate', path: '/dashboard/donate' },
    { name: 'Projects', path: '/dashboard/projects' },
    { name: 'Publications', path: '/dashboard/publications' },
    { name: 'Contact us', path: '/dashboard/contactus' },
  ];
  const name = useSelector((state) => state.global.name);
  return (
    <div>
      <Header />
      <div className="w-90% lg:w-70% m-auto">
        <SectionTitle
          name={`${t('Welcome back')}, ${name}`}
          additional="py-10"
        />
        <SectionTitle name={t('To edit content, choose a page')} color="red" />
        <div className="grid lg:grid-cols-3 gap-2 pt-5 pb-10">
          {pages.map((page, index) => (
            <div
              key={index}
              className="block p-6 max-w-sm bg-white rounded-lg shadow-md hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                props.history.push(page.path);
              }}
            >
              <SectionTitle name={t(page.name)} />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
