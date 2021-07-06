import { useForm } from 'react-hook-form';
import React from 'react';
import {
  FormErrorMessage,
  FormControl,
  Input,
  Button,
  HStack,
  Stack,
} from '@chakra-ui/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { StoreContext } from '../utils/store';
import 'react-toastify/dist/ReactToastify.css';

const LoginForm = () => {
  const history = useHistory();

  const context = React.useContext(StoreContext);
  const { setAuthToken, setLoggedIn, setEmail } = context;

  const schema = Yup.object().shape({
    email: Yup.string().email().required('Username required'),
    password: Yup.string().required('No password provided.'),
  });

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  React.useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setAuthToken(loggedInUser.token);
      setLoggedIn(true);
      history.push('/Home');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (formData) => {
    const body = JSON.stringify({ ...formData });
    try {
      const res = await axios({
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        url: 'auth/login',
        data: body,
      });
      const { data } = res;
      const { Authorization } = data;
      toast.info(`Message: ${data.message}`);
      setAuthToken(Authorization);
      setLoggedIn(true);
      const { email } = formData;
      setEmail(email);
      const userData = JSON.stringify({ email, token: Authorization });
      localStorage.setItem('user', userData);
      history.push('/Home');
    } catch (error) {
      toast.error(`Error: ${error}`);
    }
  };

  return (
    <Stack
      spacing={3}
      w="350px"
      p={5}
      border="1px"
      borderColor="gray.400"
      boxShadow="sm"
      rounded="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.email} mb={3}>
          <Input
            colorScheme="red"
            autoFocus
            placeholder="Email..."
            type="text"
            name="email"
            ref={register}
          />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.password}>
          <Input
            placeholder="Password..."
            type="text"
            name="password"
            ref={register}
          />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>
        <HStack>
          <FormControl>
            <Button mt={2} colorScheme="blue" type="submit">
              Login
            </Button>
            <Button
              mt={2}
              ml={5}
              colorScheme="teal"
              onClick={() => history.push('/signup')}
            >
              Sign up
            </Button>
          </FormControl>
        </HStack>
      </form>
    </Stack>
  );
};

export default LoginForm;
