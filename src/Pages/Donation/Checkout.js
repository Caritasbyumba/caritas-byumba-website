import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import Footer from '../../components/containers/Footer';
import Header from '../../components/containers/Header';
import { CardBody, Quotes } from '../../components/text';
import { Button } from '../../components/UI/button';
import CustomHelmet from '../../components/UI/Helmet';

const Checkout = () => {
  const { t } = useTranslation();
  const selectedLanguage = useSelector(
    (state) => state.global.selectedLanguage
  );
  const location = useLocation();
  const history = useHistory();
  const { name, chosenArea, chosenAreaDescription } = location.state;
  return (
    <div>
      <CustomHelmet name="DONATE" />
      <Header />
      <div className="my-40">
        <div className="w-90% md:w-70% m-auto shadow">
          <div role="alert">
            <div class="md:flex md:space-x-2 bg-red text-white font-bold rounded-t px-4 py-2">
              <CardBody
                name={`${t('Thank you')} ${name} ${t('for donating to')} `}
              />
              <Quotes>
                <CardBody name={chosenArea[selectedLanguage]} color="white" />
              </Quotes>
              <CardBody name={` ${t('project')}`} />
            </div>
            <div class="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
              <CardBody name={chosenAreaDescription[selectedLanguage]} />
              <div className="text-center py-3">
                <Button
                  name={t('Go to homepage')}
                  isSquare
                  outline="false"
                  color="red"
                  clicked={() => {
                    history.push('/');
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
