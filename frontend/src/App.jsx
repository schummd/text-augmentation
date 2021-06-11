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
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  VStack,
  Image,
  Text,
  Center,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import LoginButton from "./components/LoginBtn";
import LogoutButton from "./components/LogoutBtn";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect, useState } from "react";

const Links = ["Find papers", "Saved papers"];

const NavLink = ({ children }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={"#"}
  >
    {children}
  </Link>
);

export default function Simple() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [articleText, setArticleText] = useState("");
  const [newData, setNewData] = useState(false);

  useEffect(() => {
    axios({
      method: "get",
      url: "http://0.0.0.0:5000/dummy_resource",
    })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setArticleText(data.article);
      });
  }, [newData]);

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {isAuthenticated &&
                Links.map((link) => <NavLink key={link}>{link}</NavLink>)}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            {!isAuthenticated && <LoginButton></LoginButton>}
            {isAuthenticated && (
              <HStack>
                <Text>Logged in as {user.name}</Text>
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                  >
                    <Avatar size={"sm"} src={user.picture} />
                  </MenuButton>
                  <MenuList>
                    <MenuItem>
                      <LogoutButton></LogoutButton>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={2} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={2}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
      <Box p={2}></Box>
      <Center>
        <VStack>
          <Button colorScheme="purple" onClick={() => setNewData(!newData)}>
            Fetch from flask
          </Button>
          <Box bg="tomato" w="90vh" color="white">
            {articleText}
          </Box>
        </VStack>
      </Center>
    </>
  );
}
