import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

ReactDOM.render(
  <ChakraProvider>
    <Auth0Provider
      domain="dev-q-ht7raj.au.auth0.com"
      clientId="R6sDF2H2u64W7KPXxhEgXVOqR4n5vDlW"
      redirectUri={window.location.origin}
    >
      <App />
    </Auth0Provider>
  </ChakraProvider>,
  document.getElementById('root')
);
