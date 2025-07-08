import React from 'react';
import { NormalText } from '../text';
import Button from './buttons';

const ErrorMessage = ({ message, error, retryFn }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg">
      <NormalText 
        name={message || "Something went wrong"} 
        color="red-600" 
        additional="text-xl mb-4"
      />
      {error && (
        <code className="bg-gray-100 p-2 rounded mb-4 text-sm">
          {error.status} - {JSON.stringify(error.data)}
        </code>
      )}
      {retryFn && (
        <Button 
          onClick={retryFn}
          text="Try Again"
          variant="primary"
          size="medium"
        />
      )}
    </div>
  );
};

export default ErrorMessage;