import React from 'react';
import { Flex, Box, useColorMode } from '@chakra-ui/react';
import { StoreContext } from '../utils/store';
import LogoutBtn from './LogoutBtn';
import { bgColor, textColor } from '../styles/styles';

const Navbar = () => {
  const context = React.useContext(StoreContext);
  const { loggedIn, email } = context;
  const { colorMode } = useColorMode();

  return (
    <Flex
      w="100vw"
      bg={bgColor[colorMode]}
      align="center"
      color={textColor[colorMode]}
      justify="center"
      fontSize={['md', 'lg', 'xl', 'xl']}
      h="7vh"
      boxShadow="md"
    >
      <Flex justify="space-around">
        {loggedIn && <Box>{`Logged in as ${email}`}</Box>}
        <Box>{loggedIn && <LogoutBtn>Logout</LogoutBtn>}</Box>
      </Flex>
    </Flex>
  );
};

export default Navbar;
