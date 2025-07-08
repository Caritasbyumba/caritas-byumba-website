import { useTranslation } from 'react-i18next';
import { useFetchActiveFaqsQuery } from '../../features/API/user-api-slice';
import CustomHelmet from '../../components/UI/Helmet';
import Header from '../../components/containers/Header';
import { SectionTitle } from '../../components/text';
import Spinner from '../../components/UI/spinner';
import Footer from '../../components/containers/Footer';
import Faq from '../../components/containers/contactus/Faq';
import Wrapper from '../../components/containers/admin/Wrapper';

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
