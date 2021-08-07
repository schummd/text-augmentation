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
  Typography,
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
  logoUserDiv: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  readMoreLogoDiv: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: '8px',
    marginRight: '1em',
  },
  img: {
    maxWidth: '64px',
  },
  usernameDiv: {
    display: 'flex',
    justifyContent: 'flex-start',
    width: '100%',
    marginLeft: '1em',
  },
}));

const Navigation = ({ page }) => {
  const context = React.useContext(StoreContext);
  const urlBase = context.urlBase;
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const token = context.token[0];
  const setUsername = context.username[1];
  const setToken = context.token[1];
  const setSingularRead = context.singularRead[1];

  const btnLogout = () => {
    console.log(token);
    axios({
      method: 'POST',
      url: `${urlBase}/auth/logout`,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: `Authorization: ${token}`,
      },
    })
      .then(() => {
        setToken(null);
        history.push('/login');
        setUsername(null);
        localStorage.clear();
      })
      .catch((error) => {
        console.log(error);
        let errorText = '';
        error.response.data.error !== undefined
          ? (errorText = error.response.data.error)
          : (errorText = 'Invalid Auth token');
        toast.error(errorText, {
          position: 'top-right',
          hideProgressBar: true,
          style: {
            backgroundColor: '#cc0000',
            opacity: 0.8,
            textAlign: 'center',
            fontSize: '18px',
          },
        });
        setToken(null);
        history.push('/login');
        setUsername(null);
      });
  };
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const [usersname, setUsersname] = React.useState(storedUser.username);
  const [search, setSearch] = context.search
  const [header, setHeader] = context.header
  const btnProfile = () => {
    const profileUrl = "/user/" + usersname
    history.push(profileUrl);
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
              <Box className={classes.logoUserDiv}>
                <Box className={classes.readMoreLogoDiv}>
                  <Tooltip title="ReadMore">
                    <img
                      className={classes.img}
                      src={ReadMoreLogo}
                      alt="ReadMore logo"
                    />
                  </Tooltip>
                </Box>
                <Box className={classes.usernameDiv}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      {`User: ${usersname}`}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={4} align="center">
              <ButtonGroup>
                <Tooltip title="Read Mode">
                  <Button
                    id="new-article-button"
                    variant="contained"
                    color={
                      page.includes('articles') === true
                        ? "primary"
                        : "default"
                    }
                    className={classes.btnText}
                    onClick={() => {
                      history.push('/articles/new');
                    }}
                  >
                    Reader
                  </Button>
                </Tooltip>
                <Tooltip title="My Reads">
                  <Button
                    id="texts-button"
                    variant="contained"
                    color={
                      page === '/myreads'
                        ? "primary"
                        : "default"
                    }
                    className={classes.btnText}
                    onClick={() => {
                      history.push('/myreads');
                    }}
                  >
                    My Reads
                  </Button>
                </Tooltip>
                <Tooltip title="User Network">
                  <Button
                    id="profile-button"
                    variant="contained"
                    color={
                      page === '/user/network'
                        ? "primary"
                        : "default"
                    }
                    className={classes.btnText}
                    onClick={() => {
                      history.push('/user/network');
                    }}
                  >
                    Network 
                  </Button>
                </Tooltip>
                <Tooltip title="News Feed">
                  <Button
                    id="home-button"
                    variant="contained"
                    color={
                      page === '/newsfeed'
                        ? "primary"
                        : "default"
                    }
                    className={classes.btnText}
                    onClick={() => {
                      setSearch(false)
                      setHeader('Newsfeed')
                      history.push('/home');
                    }}
                  >
                    News Feed
                  </Button>
                </Tooltip>
              </ButtonGroup>
            </Grid>

            <Grid container item xs={4} align="flex-end" justify="flex-end">
              <Tooltip title="My Profile">
                <Button
                  id="profile-button"
                  variant="contained"
                  color={
                    page === `/user/${usersname}`
                      ? "primary"
                      : "default"
                  }
                  className={classes.btnText}
                  onClick={() => {
                    btnProfile();
                  }}
                >
                  Profile
                </Button>
              </Tooltip>             
              <Tooltip title="Logout">
                <Button
                  id="logout-button"
                  variant="contained"
                  color="default"
                  className={classes.btnText}
                  onClick={() => {
                    btnLogout();
                  }}
                >
                  Logout
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Navigation;
