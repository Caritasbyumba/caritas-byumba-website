import React, { useCallback, useState } from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { useTranslation } from 'react-i18next';
import Input from '../../UI/input';
import { Button } from '../../UI/button';
import axios from '../../../axios-base';
import { useSelector } from 'react-redux';

const Payment = (props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState(100000);
  const [amounts] = useState([5000, 10000, 25000, 50000, 100000]);
  const { t } = useTranslation();
  const { chosenArea, history } = props;
  const selectedLanguage = useSelector(
    (state) => state.global.selectedLanguage
  );

  const makeDonation = useCallback(
    (payment) => {
      axios
        .post('/api/donation/add', {
          name: payment.customer.name,
          email: payment.customer.email,
          chosenArea: chosenArea,
          transactionReference: payment.flw_ref,
          amount: payment.amount,
          currency: payment.currency,
          language: selectedLanguage,
        })
        .then((res) => {
          history.push({
            pathname: '/donate/checkout',
            state: {
              name: res.data.results.name,
              chosenArea: res.data.results.donationArea.name,
              chosenAreaDescription: res.data.results.donationArea.description,
            },
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [chosenArea, history, selectedLanguage]
  );

  const config = {
    public_key: process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: Date.now(),
    amount: amount,
    currency: 'RWF',
    payment_options: 'card,mobilemoney',
    customer: {
      email: email,
      name: name,
    },
    customizations: {
      title: 'CARITAS BYUMBA DONATION',
      description: t('Donation description'),
      logo: `${process.env.REACT_APP_BACKEND_URL}/images/logo.png`,
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  return (
    <div>
      <div className="w-90% md:w-70% m-auto">
        <div className="md:flex md:space-x-2">
          <Input
            label={t('Name')}
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
            label={t('Email')}
            elementType="input"
            elementConfig={{
              type: 'text',
              placeholder: t('Email'),
            }}
            value={email}
            changed={setEmail}
            validation={{ required: true, isEmail: true }}
            shouldValidate
            error={t('Email should be valid email')}
          />
        </div>
        <div className="md:flex md:space-x-2">
          <Input
            label={t('Choose amount')}
            elementType="select"
            elementConfig={{
              startingValue: 'SELECT',
              options: amounts.map((amount) => {
                return { value: amount, displayValue: `${amount} RWF` };
              }),
            }}
            value={amount}
            changed={setAmount}
            validation={{ required: true }}
            shouldValidate
            error="Amount is required"
          />
          <Input
            label={t('Or Choose your own amount')}
            elementType="input"
            elementConfig={{
              type: 'text',
              placeholder: t('Amount'),
            }}
            value={amount}
            changed={setAmount}
            validation={{ required: true }}
            shouldValidate
            error={t('Amount is required')}
          />
        </div>
        <div className="text-center py-5">
          <Button
            name={t('Donate')}
            isSquare
            outline="false"
            color="red"
            clicked={() => {
              handleFlutterPayment({
                callback: (response) => {
                  makeDonation(response);
                  closePaymentModal(); // this will close the modal programmatically
                },
                onClose: () => {},
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Payment;
