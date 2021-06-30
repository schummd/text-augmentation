/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line import/no-duplicates
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Stack,
  VStack,
  Text,
  Center,
  Textarea,
} from '@chakra-ui/react';
import react, { useEffect, useState } from 'react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
// eslint-disable-next-line import/no-duplicates
import LogoutButton from './components/LogoutBtn';
import LoginButton from './components/LoginBtn';

const Links = ['Find papers', 'Saved papers'];

// eslint-disable-next-line react/prop-types
const NavLink = ({ children }) => (
  <Link
    px={2}
    py={1}
    rounded="md"
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href="#"
  >
    {children}
  </Link>
);

const App = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [articleText, setArticleText] = useState('');
  const [newData, setNewData] = useState(false);

  // Fetch DB data from frontend-dev-server
  useEffect(() => {
    const fetchDataFromBackend = async () => {
      try {
        const res = await axios({
          method: 'get',
          url: 'http://localhost:3001/',
        });
        const { data } = res;
        setArticleText(data.db.alex.article);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDataFromBackend();
  }, [newData]);

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems="center">
            <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
              {isAuthenticated &&
                Links.map((link) => <NavLink key={link}>{link}</NavLink>)}
            </HStack>
          </HStack>
          <Flex alignItems="center">
            {!isAuthenticated && <LoginButton />}
            {isAuthenticated && (
              <HStack>
                <Text>Logged in as {user.name}</Text>
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded="full"
                    variant="link"
                    cursor="pointer"
                  >
                    <Avatar size="sm" src={user.picture} />
                  </MenuButton>
                  <MenuList>
                    <MenuItem>
                      <LogoutButton />
                    </MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={2} display={{ md: 'none' }}>
            <Stack as="nav" spacing={2}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
      <Box p={2} />
      <Center>
        <VStack>
          <Button colorScheme="purple" onClick={() => setNewData(!newData)}>
            Fetch from Express backend
          </Button>
          <Textarea
            value={articleText}
            onChange={() => console.log('change')}
          />
        </VStack>
      </Center>
    </>
  );
};

export default App;
