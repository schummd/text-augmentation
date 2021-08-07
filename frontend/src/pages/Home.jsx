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
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';

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
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
}));

const Home = () => {
  const context = React.useContext(StoreContext);
  const token = context.token[0];
  const storedUser = JSON.parse(localStorage.getItem('user'));
  // const [token, setToken] = React.useState(storedUser.token);
  const [username, setUsername] = React.useState(storedUser.username);
  const [search, setSearch] = context.search
  const [header, setHeader] = context.header
 
  React.useEffect(() => {
    if (token === null) {
      return <Redirect to={{ pathname: '/login' }} />;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [page, setPage] = context.pageState;
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
        url: `/text/${text_id}`,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      console.log(payload);
      const res = await axios(payload);
      const resData = res.data;
      console.log(resData);
      if (resData.status === 'success') {
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
    history.push(`/articles/${text_id}`);
  };

  const [data, setData] = React.useState([]);
  const history = useHistory();

  // get newsfeed articles
  const getArticles = async () => {
    setLoadingState('loading');
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

  // get article titles of the connected reader
  React.useEffect(() => {
    setPage('/newsfeed');
    if (search) {
      handleSearch(search);
      console.log("Search is", search)
      
    } else {
      getArticles();
      console.log("Search is", search)
    }
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  // search for articles
  async function handleSearch(e) {
    setSearch(true);
    console.log('searched words are', e);
    if (e.keyCode === 13 || e.code === 'NumpadEnter') {
      const words = e.target.value;
      console.log('searched words are ', e.target.value);
      setLoadingState('loading');
      try {
        const payload = {
          method: 'GET',
          url: `/user/${username}/search`,
          headers: {
            'Content-Type': 'application/json',
          },
          params: {"search_string": {words}}
        };
        console.log(payload);
        const res = await axios(payload);
        const resData = res.data;
        console.log(resData);
 
        if (resData.status === 'success') {
          console.log('success');
        } else {
          toast.warn(`${resData.message}`);
        }
        const { rdata } = resData;
        setData(resData.data);
        setHeader('Search Results') 
        console.log(data);
        setLoadingState('done');
      } catch (error) {
        toast.error('Error retrieving Reads from server.');
      }
    }
  }

  console.log('data', data);
  const RenderItems = () => {
    
    const feed = data.map((dataIn) => (
     <Box > 
      <div key={dataIn.followee_username}>
        {/* {
        dataIn.followee_first_name &&
        `${dataIn.followee_first_name}` `${dataIn.followee_last_name}`
      }
      {
        dataIn.followee_first_name === '' &&
        `${dataIn.followee_username}`
      } */}
        {dataIn.followee_first_name} {dataIn.followee_last_name}
        <ul>
          {dataIn.text_titles.map((text_titles) => (
            <Typography key={text_titles.text_title} color="inherit">
              {text_titles.text_title}

              <Box sx={{ '& button': { m: 1 } }}>
                <Button
                  size="small"
                  color="primary"
                  onClick={() =>
                    viewText(text_titles.text_id, dataIn.followee_username)
                  }
                >
                  View Article
                  <DoubleArrowIcon
                    color="primary"
                    fontSize="small"
                    padding="10px"
                  />
                </Button>
              </Box>
            </Typography>
          ))}
        </ul>
        <br></br>
      </div></Box>
    ));

    return feed;
  };

  const classes = useStyles();
  return (
    <Container>
      <Navigation page={page} />
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
                  {header}
                </Typography>
              </Box>
              <Box position="relative" display="inline-block">
                <Paper component="form" className={classes.root}>
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                  <InputBase
                    className={classes.input}
                    placeholder="Search Articles"
                    inputProps={{ 'aria-label': 'search articles' }}
                    onKeyDown={(e) => setSearch(e)}
                  />
                </Paper>
              </Box>
            </Box>
            {data.length > 0 && (
              <ul>
                <RenderItems />
              </ul>
            )}
            <br />
            <br />
          </Box>
        )}
      </Container>
    </Container>
  );
};

export default Home;
