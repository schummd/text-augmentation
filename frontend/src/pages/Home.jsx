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
import axios from 'axios';
import { toast } from 'react-toastify';
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

  const viewText = (id) => {
    console.log('View Text', id);
  };

  const data = [
    {
      followee_username: 'emily',
      followee_last_name: 'Tong',
      followee_first_name: 'Emily',
      text_titles: [
        {
          text_title:
            'Late unexpected complete fracture of a right ventricular lead still capturing the myocardium',
          text_id: 'afe1b2ab-10b2-44e5-a395-cf1d98131311',
        },
        {
          text_title:
            "Complement-mediated autoimmune haemolytic anaemia as an initial presentation of Legionnaires' disease",
          text_id: '9a61bc5e-784c-4081-b98f-6099966f1ecf',
        },
      ],
    },
    {
      followee_username: 'emily',
      followee_last_name: 'Tong',
      followee_first_name: 'Emily',
      text_titles: [
        {
          text_title:
            'Late unexpected complete fracture of a right ventricular lead still capturing the myocardium',
          text_id: 'afe1b2ab-10b2-44e5-a395-cf1d98131311',
        },
        {
          text_title:
            "Complement-mediated autoimmune haemolytic anaemia as an initial presentation of Legionnaires' disease",
          text_id: '9a61bc5e-784c-4081-b98f-6099966f1ecf',
        },
      ],
    },
  ];

  class RenderItems extends React.Component {
    state = {
      data: [],
    };
    componentDidMount = () => {
      console.log(data);
      this.setState({ data });
    };

    render() {
      const { data } = this.state;
      const articles = data.map((dataIn) => {
        return (
          <div key={dataIn.followee_first_name}>
            {dataIn.followee_first_name} {dataIn.followee_last_name}
            <ul>
              {dataIn.text_titles.map((text_titles) => (
                <li key={text_titles.text_title}>{text_titles.text_title}
               <Box sx={{ '& button': { m: 1 } }}>
                      
                       <Button  size="small" onClick={() => viewText(text_titles.text_id)}>
                       View Article
                      </Button>
                    </Box></li>
              ))}
            </ul>
            <br></br>
          </div>
        );
      });

      return <div>{<React.Fragment>{articles}</React.Fragment>}</div>;
    }
  }



  //   // return mapTitles;

  //   const data = state.userData;
  //   // setLoadingState('done');
  //   const mapRows = data.map((item, index) => (
  //     <React.Fragment key={item.followee_username}>
  //       <li>
  //         <span>
  //           Name : {item.followee_first_name} {item.followee_last_name}
  //         </span>
  //         <br>{mapTitles(item.text_titles)} </br>
  //       </li>
  //     </React.Fragment>
  //   ));
  //   const mapTitles = data.map((text_titles, index) => (
  //     <React.Fragment key={text_titles.text_id}>
  //       <span>Titles: {text_titles.text_title}</span>
  //       <button onClick={() => viewText(text_titles.text_id)}>
  //         View Article
  //       </button>
  //     </React.Fragment>
  //   ));

  //   return mapRows;
  // };
  const rootElement = document.getElementById('root');

  // React.useEffect(() => {
  // ReactDOM.render(<RenderItems />, rootElement);
  // }, []);

  // React.useEffect(() => {
  //   setPage('/home');
  //   async function setupHome () {
  //     setLoadingState('loading');
  //     setLoadingState('done');
  //   }
  //   setupHome();
  // }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const Newsfeed = () => {
    const context = React.useContext(StoreContext);
    const [username] = context.username;
    const [myReads, setMyReads] = context.myReads;
    const history = React.useHistory();
  
    React.useEffect(() => {
      setPage('/home');
      setLoadingState('loading');
      const getArticles = async () => {
        console.log(username);
        try {
          const payload = {
            method: 'GET',
            url: `/text/${username}/newsfeed`,
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
  
  }


  const classes = useStyles();
  return (
    <Container>
      <Navigation />
      <Container className={classes.container}>
        {/* {loadingState !== 'done' && (
          <div>
            <CircularProgress color="primary" />
          </div>
        )}
        {loadingState === 'done' && ( */}
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
        {/* )} */}
      </Container>
    </Container>
  );
};

export default Home;
