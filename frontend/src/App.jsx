import React from 'react';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import NewsFeed from './pages/NewsFeed';
import MyReads from './pages/MyReads';
import Article from './pages/Article';
import UserList from './pages/UserList';
import UserProfile from './pages/UserProfile';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import StoreProvider from './utils/store';
import { makeStyles } from '@material-ui/core/styles';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles((theme) => ({
  footerDiv: {
    backgroundColor: theme.palette.background.paper,
  },
  appBg: {
    fontSize: '20px',
    fontFamily: 'Calibri',
    backgroundColor: '#F0F0F0',
  },
  appBody: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
}));

function App() {
  const classes = useStyles();
  return (
    <StoreProvider>
      <div className={classes.appBg}>
        <div className={classes.appBody}>
          <Router>
            <Switch>
              <Route exact path="/">
                <Redirect to="/login" />
              </Route>
              <Route exact path="/login">
                <Login />
              </Route>
              <Route exact path="/register">
                <Register />
              </Route>
              <Route exact path="/newsfeed">
                <NewsFeed />
              </Route>
              <Route exact path="/myreads">
                <MyReads />
              </Route>
              <Route exact path="/articles/:id">
                <Article />
              </Route>
              <Route exact path="/userlist">
                <UserList />
              </Route>
              <Route exact path="/user/:username">
                <UserProfile />
              </Route>
              <Route path="/">
                <Redirect to="/login" />
              </Route>
            </Switch>
          </Router>
        </div>
      </div>
      <ToastContainer
        autoClose={3000}
        transition={Slide}
        limit={3}
        style={{
          justifyContent: 'center',
          textAlign: 'center',
        }}
      />
    </StoreProvider>
  );
}

export default App;
