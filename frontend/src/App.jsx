/* eslint-disable import/order */
/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line import/no-duplicates
import StoreProvider from './utils/store';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Center } from '@chakra-ui/react';
import Home from './pages/Home';
import SignupForm from './components/SignupForm';
import Navbar from './components/Navbar';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginForm from './components/LoginForm';

const App = () => (
  <StoreProvider>
    <ToastContainer />
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Center h="70vh">
            <LoginForm />
          </Center>
        </Route>
        <Route exact path="/signup">
          <Center h="70vh">
            <SignupForm />
          </Center>
        </Route>
        <Route exact path="/Home">
          <Home />
        </Route>
        <Route exact path="/login">
          <Center h="70vh">
            <LoginForm />
          </Center>
        </Route>
      </Switch>
    </Router>
  </StoreProvider>
);

export default App;
