import { Center, Text, VStack } from '@chakra-ui/layout';
// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import { StoreContext } from '../utils/store';

const Home = () => {
  const context = React.useContext(StoreContext);
  const { authToken, setAuthToken, setLoggedIn } = context;

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const userData = JSON.parse(loggedInUser);
      setAuthToken(userData.token);
      setLoggedIn(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Center>
      <VStack>
        <Text fontSize="3xl">Homepage</Text>
        {authToken && <Text>{`Auth token: ${authToken}`}</Text>}
      </VStack>
    </Center>
  );
};

export default Home;
