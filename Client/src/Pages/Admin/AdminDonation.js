import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import DonationArea from '../../Components/Containers/Donation/DonationArea';
import Payment from '../../Components/Containers/Donation/Payment';
import Footer from '../../Components/Containers/Footer';
import Header from '../../Components/Containers/Header';
import { CardBody, PageTitle, SectionTitle } from '../../Components/text';
import CustomHelmet from '../../Components/UI/Helmet';
import Spinner from '../../Components/UI/spinner';
import Wrapper from '../../Components/Containers/Admin/Wrapper';
import {
  useFetchActiveDonateIntroQuery,
  useFetchActiveDonationAreaIntroQuery,
} from '../../Features/API/user-api-slice';

const AdminDonation = (props) => {
  const { t } = useTranslation();
  const { data = [], isFetching } = useFetchActiveDonateIntroQuery();
  const { data: donationAreasData = [], isFetching: isDonationAreasFetching } =
    useFetchActiveDonationAreaIntroQuery();
  const selectedLanguage = useSelector(
    (state) => state.global.selectedLanguage
  );
  const [chosenArea, setChosenArea] = useState(0);
  const donateIntro = data.results;
  const donationAreas = donationAreasData.results;
  return (
    <div>
      <CustomHelmet name="DONATE" />
      <Header />
      {isFetching ? (
        <Spinner />
      ) : (
        <Wrapper {...props} item="donationintro">
          <div className="bg-gray-200 py-5">
            <div className="w-90% lg:w-70% m-auto">
              <PageTitle
                name={donateIntro.title[selectedLanguage]}
                color="red"
                additional="text-center py-5"
              />
              <CardBody
                name={donateIntro.description[selectedLanguage]}
                additional="text-center"
              />
            </div>
          </div>
        </Wrapper>
      )}
      {isDonationAreasFetching ? (
        <Spinner />
      ) : (
        <Wrapper {...props} item="donationareas">
          <SectionTitle
            name={t('Which project would you like to donate to?')}
            color="red"
            additional="text-center py-5"
          />
          <div className="w-90% lg:w-70% m-auto grid grid-cols-1 md:grid-cols-3 gap-2 py-5">
            {donationAreas.map((area, index) => (
              <DonationArea
                key={index}
                {...area}
                isChosen={chosenArea === index}
                onClick={() => setChosenArea(index)}
              />
            ))}
          </div>
        </Wrapper>
      )}
      <Payment
        {...props}
        chosenArea={donationAreas ? donationAreas[chosenArea]._id : ''}
      />
      <Footer />
    </div>
  );
};

export default AdminDonation;
