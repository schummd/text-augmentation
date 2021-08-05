import React from 'react';
import { StoreContext } from '../utils/store';
import Navigation from '../components/Navigation';
import { Redirect, useHistory } from 'react-router-dom';

// List imports
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import DescriptionIcon from '@material-ui/icons/Description';

import {
  makeStyles,
  Box,
  Container,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import axios from 'axios';
import { toast } from 'react-toastify';

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
    width: '100%',
  },
  titleDiv: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    margin: 'auto',
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
  },
}));

const MyReads = () => {
  const context = React.useContext(StoreContext);
  const [username] = context.username;
  const [myReads, setMyReads] = context.myReads;

  const history = useHistory();

  React.useEffect(() => {
    setPage('/myreads');
    setLoadingState('loading');
    const getArticles = async () => {
      console.log(username);
      try {
        const payload = {
          method: 'GET',
          url: `/text/${username}`,
          headers: {
            'Content-Type': 'application/json',
          },
        };
        console.log(payload);
        const res = await axios(payload);
        const resData = res.data;
        console.log(resData);
        if (resData.status === 'success') {
          // toast.success(`Retrieved Reads from server.`);
          console.log('success');
        } else {
          toast.warn(`${resData.message}`);
        }
        const { data } = resData;
        setMyReads(data);
        console.log(data);
        setLoadingState('done');
      } catch (error) {
        toast.error('Error retrieving Reads from server.');
      }
    };

    getArticles();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setPage = context.pageState[1];
  const [loadingState, setLoadingState] = React.useState('load');

  const classes = useStyles();
  return (
    <Container>
      <Navigation />
      <Container className={classes.container}>
        {loadingState !== 'done' && (
          <div>
            <CircularProgress color="primary" />
          </div>
        )}
        {loadingState === 'done' && (
          <Box className={classes.containerDiv}>
            <Box className={classes.titleDiv}>
              <List component="nav" aria-label="My Reads">
                {myReads.map((myRead, idx) => {
                  return (
                    <ListItem
                      key={idx}
                      button
                      onClick={() => {
                        console.log(`Username: ${username}`);
                        console.log(JSON.parse(myRead.text_body));
                        history.push(`/articles/${myRead.text_id}`);
                      }}
                    >
                      <ListItemIcon>
                        <DescriptionIcon />
                      </ListItemIcon>
                      <ListItemText primary={myRead.text_title} />
                    </ListItem>
                  );
                })}
              </List>
              <Divider />
            </Box>
            <br />
            <br />
          </Box>
        )}
      </Container>
    </Container>
  );
};

export default MyReads;
