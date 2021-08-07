import React from 'react';
import ReadMoreLogo from '../assets/readmore-logo.png';
import { useHistory } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { StoreContext } from '../utils/store';
import {
  makeStyles,
  Container,
  Button,
  Box,
  TextField,
  FormControl,
  Tooltip,
  Typography,
  Divider,
} from '@material-ui/core';
import axios from 'axios';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: '50px',
    paddingBottom: '50px',
    alignItems: 'center',
    color: 'gray',
    height: '100%',
    backgroundColor: '#F0F0F0',
  },
  titleContainer: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: '25px',
    paddingBottom: '25px',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    margin: '20px',
    justifyContent: 'center',
    maxHeight: '250px',
    maxWidth: '266px',
  },
  img: {
    maxHeight: '250px',
    maxWidth: '266px',
  },
  appTitle: {
    margin: theme.spacing(2),
  },
  box: {
    display: 'flex',
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
    width: '14em',
  },
  textarea: {
    color: '#648dae',
  },
  toasty: {
    textAlign: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
}));

const Login = () => {
  const context = React.useContext(StoreContext);
  const urlBase = context.urlBase;
  console.log(urlBase);
  const setToken = context.token[1];
  const setPage = context.pageState[1];
  const setUsername = context.username[1];

  const history = useHistory();
  const toastErrorStyle = {
    backgroundColor: '#cc0000',
    opacity: 0.8,
    textAlign: 'center',
    fontSize: '18px',
  };
  const { handleSubmit, control } = useForm();
  const onSubmit = (data) => {
    if (data.username === '') {
      toast.error('Please enter your Email', {
        position: 'top-right',
        hideProgressBar: true,
        style: toastErrorStyle,
      });
    } else if (data.password === '') {
      toast.error('Please enter your Password', {
        position: 'top-right',
        hideProgressBar: true,
        style: toastErrorStyle,
      });
    } else {
      axios({
        method: 'POST',
        url: `${urlBase}/auth/login`,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
        data: {
          email: data.email,
          password: data.password,
        },
      })
        .then((response) => {
          console.log(response);
          setToken(response.data.Authorization);
          setUsername(response.data.username);
          localStorage.setItem(
            'user',
            JSON.stringify({
              username: response.data.username,
              token: response.data.Authorization,
            })
          );
          setPage('/articles/');
          history.push('/articles/new');
        })
        .catch((error) => {
          let errorText = '';
          error.response.data.error !== undefined
            ? (errorText = error.response.data.error)
            : (errorText = 'Invalid input');
          toast.error(errorText, {
            position: 'top-right',
            hideProgressBar: true,
            style: toastErrorStyle,
          });
        });
    }
  };
  React.useEffect(() => {
    setPage('/login');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const btnRegister = () => {
    history.push('/register');
  };
  const classes = useStyles();
  return (
    <Container className={classes.container}>
      <Box className={classes.logo}>
        <Tooltip title="ReadMore" aria-label="readmore logo">
          <img className={classes.img} src={ReadMoreLogo} alt="ReadMore Logo" />
        </Tooltip>
      </Box>
      <br />
      <Box className={classes.titleContainer}>
        <Typography variant="h4">ReadMore</Typography>
        <Divider />
        <Typography variant="h5">Log In</Typography>
      </Box>
      <br />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className={classes.box}>
          <FormControl>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  label="Email"
                  color="primary"
                  variant="filled"
                  {...field}
                />
              )}
            />
          </FormControl>
        </Box>
        <Box className={classes.box}>
          <FormControl>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  type="password"
                  label="Password"
                  color="primary"
                  variant="filled"
                  {...field}
                />
              )}
            />
          </FormControl>
        </Box>
        <br />
        <Tooltip title="Login" aria-label="log in">
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            type="submit"
          >
            Login
          </Button>
        </Tooltip>
      </form>
      <Box className={classes.box}>
        <Tooltip title="New User" aria-label="new user">
          <Button
            className={classes.button}
            variant="contained"
            color="default"
            onClick={btnRegister}
          >
            Register
          </Button>
        </Tooltip>
      </Box>
      <br />
    </Container>
  );
};

export default Login;
