import React from 'react';
import ReadMoreLogo from '../assets/readmore-logo.png';
import { StoreContext } from '../utils/store';
import { useHistory } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
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
    justifyContent: 'flex-start',
    paddingTop: '50px',
    paddingBottom: '50px',
    alignItems: 'center',
    color: 'gray',
    width: '100%',
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
  box: {
    display: 'flex',
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
    width: '14em',
  },
}));

const Register = () => {
  const context = React.useContext(StoreContext);
  const urlBase = context.urlBase;
  const history = useHistory();
  const toastErrorStyle = {
    backgroundColor: '#cc0000',
    opacity: 0.8,
    textAlign: 'center',
    fontSize: '18px'
  };
  const { handleSubmit, control } = useForm();
  const onSubmit = (data) => {
    console.log("Got data", data)
    if (data.email === '') {
      toast.error(
        'Please enter your Email address', {
          position: 'top-right',
          hideProgressBar: true,
          style: toastErrorStyle
        }
      );
    } else if (data.password === '') {
      toast.error(
        'Please enter your Password', {
          position: 'top-right',
          hideProgressBar: true,
          style: toastErrorStyle
        }
      );
    } else if (data.username === '') {
      toast.error(
        'Please enter your Username', {
          position: 'top-right',
          hideProgressBar: true,
          style: toastErrorStyle
        }
      );
    } else if (data.firstname === '') {
      toast.error(
        'Please enter your First Name', {
          position: 'top-right',
          hideProgressBar: true,
          style: toastErrorStyle
        }
      );
    } else if (data.lastname === '') {
      toast.error(
        'Please enter your Last Name', {
          position: 'top-right',
          hideProgressBar: true,
          style: toastErrorStyle
        }
      );            
    } else {

      axios({
        method: 'POST',
        url: `${urlBase}/user/`,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        data: {
          email: data.email,
          password: data.password,
          username: data.username,
          first_name: data.firstname,
          last_name: data.lastname
        }
      })
        .then((response) => {

          console.log(response);
          toast.success(
            'Successfully signed up to ReadMore', {
              position: 'top-right',
              hideProgressBar: true,
              style: {
                opacity: 0.8,
                textAlign: 'center',
                fontSize: '18px'
              }
            }
          );
          history.push('/login');
        })
        .catch((error) => {
          let errorText = '';
          error.response.data.error !== undefined
            ? errorText = error.response.data.error
            : errorText = 'Invalid input'
          toast.error(
            errorText, {
              position: 'top-right',
              hideProgressBar: true,
              style: toastErrorStyle
            }
          );
        })
    }
  };
  const btnLogin = () => {
    history.push('/login');
  };
  const classes = useStyles();
  return (
    <Container className={classes.container}>
      <Box className={classes.logo}>
        <Tooltip title="ReadMore" aria-label="readmore logo">
          <img
            className={classes.img}
            src={ReadMoreLogo}
            alt="ReadMore Logo"
          />
        </Tooltip>
      </Box>
      <br />
      <Box className={classes.titleContainer}>
        <Typography variant="h4">
          ReadMore
        </Typography>
        <Divider />
        <Typography variant="h5">
          Sign Up
        </Typography>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className={classes.box}>
          <FormControl>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              required
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
              required
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
        <Box className={classes.box}>
          <FormControl>
            <Controller
              name="username"
              control={control}
              defaultValue=""
              required
              render={({ field }) => (
                <TextField
                  label="Username"
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
              name="firstname"
              control={control}
              defaultValue=""
              required
              render={({ field }) => (
                <TextField
                  label="First Name"
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
              name="lastname"
              control={control}
              defaultValue=""
              required
              render={({ field }) => (
                <TextField
                  label="Last Name"
                  color="primary"
                  variant="filled"
                  {...field}
                />
              )}
            />
          </FormControl>
        </Box>                
        <br />
        <Tooltip title="Sign Up" aria-label="sign up">
          <Button
            className={classes.button}
            variant="contained" color="primary" type="submit"
          >
            Sign Up
          </Button>
        </Tooltip>
      </form>
      <Box className={classes.box}>
        <Tooltip title="Back to Login" aria-label="back to login">
          <Button
            className={classes.button}
            variant="contained" color="default" onClick={btnLogin}
          >
            Login
          </Button>
        </Tooltip>
      </Box>
    </Container>
  )
}

export default Register;
