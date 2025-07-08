import { useTranslation } from 'react-i18next';
import { useFetchActiveFaqsQuery } from '../../Features/API/user-api-slice';
import CustomHelmet from '../../Components/UI/Helmet';
import Header from '../../Components/Containers/Header';
import { SectionTitle } from '../../Components/text';
import Spinner from '../../Components/UI/spinner';
import Footer from '../../Components/Containers/Footer';
import Faq from '../../Components/Containers/Contactus/Faq';
import Wrapper from '../../Components/Containers/Admin/Wrapper';

const AdminContactus = (props) => {
  const { t } = useTranslation();
  const { data = [], isFetching } = useFetchActiveFaqsQuery();

  return (
    <div>
      <CustomHelmet name="CONTACT US" />
      <Header />
      <Wrapper {...props} item="faqs">
        <div className="w-90% lg:w-70% m-auto">
          <SectionTitle
            name={t('Frequently Asked Questions')}
            color="red"
            additional="text-center pt-5 pb-10"
          />
          {isFetching ? (
            <Spinner />
          ) : (
            data.results.map((faq, index) => <Faq key={index} {...faq} />)
          )}
        </div>
      </Wrapper>
      <Footer />
    </div>
  );
};

export default AdminContactus;
