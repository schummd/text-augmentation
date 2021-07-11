import React from 'react';
import ReadMoreLogo from '../assets/readmore-logo.png';
import { useHistory } from 'react-router-dom';
import { StoreContext } from '../utils/store';
import {
  ThemeProvider,
  makeStyles,
  useTheme,
  Box,
  Button,
  ButtonGroup,
  Tooltip,
  Grid,
} from '@material-ui/core';
import axios from 'axios';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
  },
  box: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#D0D0D0',
    padding: theme.spacing(2, 2, 2),
  },
  btnText: {
    fontSize: '14px',
    textTransform: 'capitalize',
  },
  readMoreLogo: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-start',
    paddingLeft: '24px',
  },
  img: {
    maxWidth: '64px',
  },
}));

const Navigation = () => {
  const context = React.useContext(StoreContext);
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const token = context.token[0];
  const setUsername = context.username[1];
  const setToken = context.token[1];

  const btnLogout = () => {
    axios({
      method: 'POST',
      url: `auth/logout`,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        "Authorization": `Authorization: ${token}`,
      }
    })
      .then(() => {
        setToken(null);
        history.push('/login');
        setUsername(null);
      })
      .catch((error) => {
        let errorText = '';
        error.response.data.error !== undefined
          ? errorText = error.response.data.error
          : errorText = 'Invalid Auth token'
        toast.error(
          errorText, {
            position: 'top-right',
            hideProgressBar: true,
            style: {
              backgroundColor: '#cc0000',
              opacity: 0.8,
              textAlign: 'center',
              fontSize: '18px'
            }
          }
        );
        setToken(null);
        history.push('/login');
        setUsername(null);
      })
  }

  return (
    <ThemeProvider theme={theme}>
      <Box className={classes.box}>
        <Box className={classes.container}>
          <Grid
            container
            spacing={0}
            alignItems="center"
            justify="center"
            align="center"
          >
            <Grid container item xs={4} align="flex-start" justify="flex-start">
              <Box className={classes.readMoreLogo}>
                <Tooltip title="ReadMore">
                  <img
                    className={classes.img}
                    src={ReadMoreLogo}
                    alt="ReadMore logo"
                  />
                </Tooltip>
              </Box>
            </Grid>

            <Grid item xs={4} align="center">
              <ButtonGroup>
                <Tooltip title="Home">
                  <Button
                    id="home-button"
                    variant="contained"
                    color="default"
                    className={classes.btnText}
                    onClick={() => {
                      history.push('/home')
                    }}
                  >
                    Home
                  </Button>
                </Tooltip>

                <Tooltip title="Texts">
                  <Button
                    id="texts-button"
                    variant="contained"
                    color="default"
                    className={classes.btnText}
                    // onClick={() => {
                    //   history.push('/mytexts')
                    // }}
                  >
                    My Texts
                  </Button>
                </Tooltip>

                <Tooltip title="New Text">
                  <Button
                    id="new-text-button"
                    variant="contained"
                    color="primary"
                    className={classes.btnText}
                    // onClick={() => {
                    //   history.push('/texts/new')
                    // }}
                  >
                    New Text
                  </Button>
                </Tooltip>

              </ButtonGroup>
            </Grid>

            <Grid container item xs={4} align="flex-end" justify="flex-end">
              <Tooltip title="Logout">
                <Button
                  id="logout-button"
                  variant="contained"
                  color="default"
                  className={classes.btnText}
                  onClick={() => { btnLogout() }}
                >
                  Logout
                </Button>
              </Tooltip>
            </Grid>

          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default Navigation;
