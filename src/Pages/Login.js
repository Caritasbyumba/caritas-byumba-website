import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Footer from '../components/containers/Footer';
import Header from '../components/containers/Header';
import { Button } from '../components/UI/button';
import CustomHelmet from '../components/UI/Helmet';
import Input from '../components/UI/input';
import { CardBody, SectionTitle } from '../components/text';
import { autoLogin, login } from '../features/global/global-slice';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../components/UI/spinner';
import { useHistory } from 'react-router-dom';

const Login = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.global.loading);
  const error = useSelector((state) => state.global.error);
  const isAuthenticated = useSelector((state) => state.global.token !== null);

  useEffect(() => {
    dispatch(autoLogin());
  }, [dispatch]);

  if (isAuthenticated) {
    history.push('dashboard');
  }

  return (
    <div>
      <CustomHelmet name="LOGIN" />
      <Header />
      <div className="block my-40 mx-5 md:mx-auto p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md">
        <SectionTitle name={t('LOGIN')} color="red" additional="uppercase" />
        <Input
          elementType="input"
          elementConfig={{
            type: 'email',
            placeholder: t('Email'),
          }}
          value={email}
          changed={setEmail}
          validation={{ required: true }}
          shouldValidate
          error={t('Email is not valid')}
        />
        <Input
          elementType="input"
          elementConfig={{
            type: 'password',
            placeholder: t('Password'),
          }}
          value={password}
          changed={setPassword}
          validation={{ required: true }}
          shouldValidate
          error={t('Name is required')}
        />
        {loading ? (
          <div>
            <Spinner small />
          </div>
        ) : (
          <Button
            name={t('Log In')}
            isSquare
            outline="false"
            color="red"
            clicked={() => {
              dispatch(login({ email: email, password: password }));
            }}
            additional="w-full mt-3"
          />
        )}
        {error && (
          <CardBody
            name={error.error}
            color="red"
            additional="font-bold text-center"
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Login;
