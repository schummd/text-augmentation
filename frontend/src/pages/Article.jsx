import React from 'react';
import { StoreContext } from '../utils/store';
import Navigation from '../components/Navigation';
import {
  Redirect,
} from 'react-router-dom';
import {
  makeStyles,
  Box,
  Container,
  Typography,
  CircularProgress,
} from '@material-ui/core';
// import axios from 'axios';
// import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'gray',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#F0F0F0',
  },
  containerDiv: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-start',
    width: '100%',
  },
  titleDiv: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    margin: theme.spacing(2),
  },
}));

const Article = () => {
  const context = React.useContext(StoreContext);
  const token = context.token[0];
  
  React.useEffect(() => {
    if (token === null) {
      return <Redirect to={{ pathname: '/login' }} />
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const setPage = context.pageState[1];
  const [loadingState, setLoadingState] = React.useState('load');

  React.useEffect(() => {
    setPage('/articles');
    async function setupHome () {
      setLoadingState('loading');
      setLoadingState('done');
    }
    setupHome();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const classes = useStyles();
  return (
    <Container>
      <Navigation />
      <Container className={classes.container}>
        {
          loadingState !== 'done' &&
          <div>
            <CircularProgress color="primary" />
          </div>
        }
        {
          loadingState === 'done' &&
          <Box className={classes.containerDiv}>
            <Box className={classes.titleDiv}>
              <Box>
                <Typography paragraph align="left" variant="h4">
                  Text
                </Typography>
              </Box>
            </Box>
            <br />
            <br />
          </Box>
        }
      </Container>
    </Container>
  );
}

export default Article;
