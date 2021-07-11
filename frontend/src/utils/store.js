import React from 'react';

export const StoreContext = React.createContext(null);

// eslint-disable-next-line react/prop-types
const Context = ({ children }) => {
  const [token, setToken] = React.useState(null);
  const [username, setUsername] = React.useState(null);
  const [page, setPage] = React.useState('/login');
  const [myTexts, setMyTexts] = React.useState([]);
  const [singularText, setSingularText] = React.useState('');

  const store = {
    token: [token, setToken],
    username: [username, setUsername],
    pageState: [page, setPage],
    myTexts: [myTexts, setMyTexts],
    singularText: [singularText, setSingularText],
  };

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export default Context;
