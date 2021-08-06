import React from 'react';
import { StoreContext } from '../utils/store';
import Navigation from '../components/Navigation';
import { Redirect } from 'react-router-dom';
import {
  makeStyles,
  Box,
  Container,
  Typography,
  CircularProgress,
} from '@material-ui/core';
// import axios from 'axios';
// import { toast } from 'react-toastify';
import ReactDOM from 'react-dom';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@material-ui/core';

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

const Home = () => {
  const context = React.useContext(StoreContext);
  const token = context.token[0];
  const storedUser = JSON.parse(localStorage.getItem('user'));
  // const [token, setToken] = React.useState(storedUser.token);
  const [username, setUsername] = React.useState(storedUser.username);

  React.useEffect(() => {
    if (token === null) {
      return <Redirect to={{ pathname: '/login' }} />;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setPage = context.pageState[1];
  const [loadingState, setLoadingState] = React.useState('load');
  // const [username] = context.username;
  const [myReads, setMyReads] = context.myReads;


  // view text of another reader
  const viewText = async (text_id, followee_username) => {
    setLoadingState('loading');

    console.log(username);
    try {
      const payload = {
        method: 'GET',
        url: `/text/${followee_username}/${text_id}`,
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
      console.log('Retrieved from backend', data);
      setLoadingState('done');
    } catch (error) {
      toast.error('Error retrieving Reads from server.');
    }
    console.log('View Text', text_id);
    // history.push(`/articles/${text_id}`);
  };

  const [data, setData] = React.useState([]);
  const history = useHistory();

  // get article titles of the connected reader
  React.useEffect(() => {
    setPage('/home');
    setLoadingState('loading');
    const getArticles = async () => {
      console.log(username);
      try {
        const payload = {
          method: 'GET',
          url: `/user/${username}/newsfeed`,
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
        const { rdata } = resData;
        setData(resData.data);
        console.log(data);
        setLoadingState('done');
      } catch (error) {
        toast.error('Error retrieving Reads from server.');
      }
    };

    getArticles();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  console.log(data);
  const RenderItems = () => {
    const resume = data.map((dataIn) => (
      <div key={dataIn.followee_first_name}>
        {dataIn.followee_first_name} {dataIn.followee_last_name}
        <ul>
          {dataIn.text_titles.map((text_titles) => (
            <li key={text_titles.text_title}>
              {text_titles.text_title}

              <Box sx={{ '& button': { m: 1 } }}>
                <Button
                  size="small"
                  onClick={() =>
                    viewText(text_titles.text_id, dataIn.followee_username)
                  }
                >
                  View Article
                </Button>
              </Box>
            </li>
          ))}
        </ul>
        <br></br>
      </div>
    ));

    return resume;
  };

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
              <Box>
                <Typography paragraph align="left" variant="h4">
                  Home
                </Typography>
                <ul>
                  <RenderItems />
                </ul>
              </Box>
            </Box>
            <br />
            <br />
          </Box>
        )}
      </Container>
    </Container>
  );
};

export default Home;
