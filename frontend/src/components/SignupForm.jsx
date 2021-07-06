import React from 'react';
import { useForm } from 'react-hook-form';
import {
  FormErrorMessage,
  FormControl,
  Input,
  Button,
  Stack,
} from '@chakra-ui/react';
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { StoreContext } from '../utils/store';
import 'react-toastify/dist/ReactToastify.css';

const SignupForm = () => {
  const context = React.useContext(StoreContext);
  const { setAuthToken, setLoggedIn, setEmail } = context;
  const history = useHistory();

  const schema = Yup.object().shape({
    email: Yup.string().email().required('Email required'),
    username: Yup.string().required('Username required'),
    password: Yup.string().required('Password required'),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .strip(),
    name: Yup.string().required('Name required'),
    publicID: Yup.string().required('Public ID required'),
  });

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  // Signup Request
  const onSubmit = async (formData) => {
    const body = JSON.stringify({ ...formData });
    try {
      const res = await axios({
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        url: 'user/',
        data: body,
      });
      const { data } = res;
      toast.info(`Message: ${data.message}`);
      toast.info(`Token: ${data.Authorization}`);
      setAuthToken(data.token);
      setLoggedIn(true);
      const { email } = formData;
      setEmail(email);
      const { token } = data;
      const userData = JSON.stringify({ user: { email, token } });
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
      <form spacing={3} onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.email} mb={3}>
          <Input
            autoFocus
            placeholder="Email..."
            type="text"
            name="email"
            ref={register}
          />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.username} mb={3}>
          <Input
            autoFocus
            placeholder="Username..."
            type="text"
            name="username"
            ref={register}
          />
          <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.password} mb={3}>
          <Input
            placeholder="Password..."
            type="text"
            name="password"
            ref={register}
          />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.passwordConfirmation}>
          <Input
            placeholder="Confirm password..."
            type="text"
            name="passwordConfirmation"
            ref={register}
          />
          <FormErrorMessage>
            {errors.passwordConfirmation?.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.name} mb={3}>
          <Input placeholder="Name..." type="text" name="name" ref={register} />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.publicID} mb={3}>
          <Input
            autoFocus
            placeholder="Public ID..."
            type="text"
            name="publicID"
            ref={register}
          />
          <FormErrorMessage>{errors.publicID?.message}</FormErrorMessage>
        </FormControl>
        <FormControl>
          <Button mt={2} colorScheme="blue" type="submit">
            Sign up
          </Button>
          <Button
            mt={2}
            ml={5}
            colorScheme="teal"
            onClick={() => history.push('/login')}
          >
            Log in
          </Button>
        </FormControl>
      </form>
    </Stack>
  );
};

export default SignupForm;
