import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {
  createTheme,
  ThemeProvider,
} from '@material-ui/core';

const theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#4791db'
    },
    secondary: {
      main: '#e33371'
    }
  }
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
