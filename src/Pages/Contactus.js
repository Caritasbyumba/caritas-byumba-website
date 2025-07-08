import React, { useState } from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { BsMailbox2 } from 'react-icons/bs';
import { MdEmail, MdLocalPhone, MdPlace } from 'react-icons/md';
import { Link } from 'react-router-dom';
import Footer from '../components/containers/Footer';
import Header from '../components/containers/Header';
import { CardBody, SectionTitle } from '../components/text';
import { Button } from '../components/UI/button';
import CustomHelmet from '../components/UI/Helmet';
import Input from '../components/UI/input';
import axios from 'axios';
import { useFetchActiveFaqsQuery } from '../features/API/user-api-slice';
import Spinner from '../components/UI/spinner';
import Faq from '../components/containers/contactus/Faq';

const Contactus = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const { data = [], isFetching } = useFetchActiveFaqsQuery();

  const sendMessage = useCallback(() => {
    setResponse(null);
    setError(null);
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/messages/send`, {
        name: name,
        email: email,
        body: body,
      })
      .then((response) => setResponse(response.data))
      .catch((err) => setError(err.response.data));
  }, [name, email, body]);

  return (
    <div>
      <CustomHelmet name="CONTACT US" />
      <Header />
      <div className="bg-red py-4 md:p-10">
        <div className="w-90% lg:w-70% m-auto flex flex-col md:flex-row md:space-x-2 bg-white rounded">
          <div className="w-full md:w-50% flex flex-col md:space-y-2 p-2 md:p-5">
            <SectionTitle name={t('Get in touch with us')} color="red" additional="text-center md:text-left" />
            <div>
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
                to={{ pathname: 'tel:+250788476714' }}
                target="_blank"
                className="flex space-x-2 items-center hover:underline"
              >
                <MdLocalPhone />
                <CardBody name="Tel: +250788476714" />
              </Link>
              <Link
                to={{ pathname: 'mailto:caritasbyumba81@gmail.com' }}
                target="_blank"
                className="flex space-x-2 items-center hover:underline"
              >
                <MdEmail />
                <CardBody name="caritasbyumba81@gmail.com" />
              </Link>
            </div>
            <div className="flex flex-col lg:flex-row justify-between lg:space-x-1 w-full">
              <Input
                elementType="input"
                elementConfig={{
                  type: 'text',
                  placeholder: t('Name'),
                }}
                value={name}
                changed={setName}
                validation={{ required: true }}
                shouldValidate
                error={t('Name is required')}
              />
              <Input
                elementType="input"
                elementConfig={{
                  type: 'email',
                  placeholder: 'Email (example@email.com)',
                }}
                value={email}
                changed={setEmail}
                validation={{ isEmail: true }}
                shouldValidate
                error={t('Valid email is required')}
              />
            </div>
            <div className="pt-2 w-full">
              <Input
                elementType="textarea"
                elementConfig={{
                  type: 'text',
                  placeholder: 'Write here your message',
                }}
                value={body}
                changed={setBody}
                validation={{ required: true }}
                shouldValidate
                error="Message should not be empty"
              />
            </div>
            <Button
              name={t('Send')}
              isSquare
              outline="false"
              color="red"
              clicked={sendMessage}
              additional="my-3"
            />
            {error && (
              <CardBody
                name={error.error}
                color="red"
                additional="font-bold text-center"
              />
            )}
            {response && (
              <CardBody
                name={response.message}
                color="green"
                additional="font-bold text-center"
              />
            )}
          </div>
          <div className="w-full md:w-50%">
            <iframe
              className="w-full h-full rounded"
              title="googlemap"
              id="gmap_canvas"
              src="https://maps.google.com/maps?q=caritas%20byumba&t=k&z=17&ie=UTF8&iwloc=&output=embed"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
            ></iframe>
          </div>
        </div>
      </div>
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
      <Footer />
    </div>
  );
};

export default Contactus;
