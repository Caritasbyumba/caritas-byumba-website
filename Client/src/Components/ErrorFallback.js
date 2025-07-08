import React from 'react';
import { CardBody } from './text';
import { useTranslation } from 'react-i18next';
import { TextButton } from './UI/button';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="my-44">
        <div className="w-90% md:w-70% m-auto shadow">
          <div role="alert">
            <div class="md:flex md:space-x-2 bg-red text-white font-bold rounded-t px-4 py-2">
              <CardBody name={`${t('Oops')}`} />
            </div>
            <div class="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
              <div className="flex space-x-2">
                <CardBody
                  name={t(
                    'Something went wrong, Please check your internet connection and'
                  )}
                />
                <TextButton
                  name={t('Try again')}
                  color="red"
                  additional="hover:underline h-fit text-left font-bold"
                  onClick={resetErrorBoundary}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
