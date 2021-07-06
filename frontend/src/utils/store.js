import React, { useState } from 'react';

export const StoreContext = React.createContext(null);

// eslint-disable-next-line react/prop-types
const Context = ({ children }) => {
  const [db, setDb] = useState('');
  const [loggedIn, setLoggedIn] = React.useState();
  const [authToken, setAuthToken] = React.useState(false);
  const [email, setEmail] = React.useState(false);

  const store = {
    db,
    setDb,
    loggedIn,
    setLoggedIn,
    authToken,
    setAuthToken,
    email,
    setEmail,
  };

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export default Context;
