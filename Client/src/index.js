import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { store } from './Store';
import { Provider } from 'react-redux';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './Components/ErrorFallback';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.reload(true);
      }}
    >
      <App />
    </ErrorBoundary>
  </Provider>
);
