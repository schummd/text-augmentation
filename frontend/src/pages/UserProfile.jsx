import React from 'react';
import Navigation from '../components/Navigation';
import { Redirect } from 'react-router-dom';
import {
  makeStyles,
  Box,
  Container,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import { StoreContext } from '../utils/store';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Tooltip } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Icon from '@material-ui/core/Icon';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import TextField from '@material-ui/core/TextField';
import { FormControl } from '@material-ui/core/';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
    display: 'inline-block',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'gray',
    minHeight: '100vh',
    width: '50%',
    backgroundColor: '#F0F0F0',
  },
  containerDiv: {
    display: 'inline-block',
    flexDirection: 'column',
    alignSelf: 'flex-start',
    width: '100%',
  },
  titleDiv: {
    display: 'inline-block',
    flexDirection: 'column',
    width: '100%',
    margin: theme.spacing(2),
    float: 'left',
  },
  btnUiDiv: {
    display: 'inline',
    paddingRight: '4px',
    paddingLeft: '50px',
  },
}));

const UserProfile = () => {
  const context = React.useContext(StoreContext);
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const [token, setToken] = React.useState(storedUser.token);
  const [username, setUsername] = React.useState(storedUser.username);
  // const username = context.username;
  // console.log("Context data", token, username)

  React.useEffect(() => {
    if (token === null) {
      return <Redirect to={{ pathname: '/login' }} />;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setPage = context.pageState[1];
  const [loadingState, setLoadingState] = React.useState('load');
  const [firstName, setFirstName] = React.useState('not provided');
  const [lastName, setLastName] = React.useState('not provided');
  const [email, setEmail] = React.useState('');
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setPage('/user');
    async function setupHome() {
      setLoadingState('loading');
      console.log('Profile page', username, token);

      // getting logged-in user information
      try {
        const payload = {
          method: 'GET',
          url: `/user/${username}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Authorization: ${token}`,
          },
        };
        console.log('Payload', payload);
        const res = await axios(payload);
        const resData = res.data;
        console.log('ResData', resData);
        // if (resData.status === 'success') {
        if (resData.username === username) {
          toast.success(`Retrieved User information from server.`);
        } else {
          toast.warn(`${resData.message}`);
        }

        setFirstName(resData.first_name);
        setLastName(resData.last_name);
        setEmail(resData.email);
        setLoadingState('done');
      } catch (error) {
        toast.error('Error retrieving User data from server.');
      }
    }
    setupHome();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // TODO: add button actions to search for users and edit profile

  const [openEditProfile, setEditProfileOpen] = React.useState(false);
  const [openSearchUsers, setEditSearchUsers] = React.useState(false);

  const [searchUsersOperate, setSearchUsersOperate] = React.useState();
  const handleUserSearch = async () => {
    React.setOpenSearchUsers(true);
    // React.setSearchUsersOperate(<SearchUsersButton />);
    // return searchUsersOperate;
  };

  // handling change in following status
  const HandleCellClick = async (param, event) => {
    const networkUsername = param.row.username;

    // sending backend 'followers' status update
    const payload = {
      method: 'PATCH',
      url: '/user/' + username + '/following',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      data: { user_to_follow: networkUsername },
    };
    console.log('Payload', payload);
    const response = await axios(payload);
    console.log('Response', response);
    if (response.status === 201) {
      toast.success(`Changed connection status.`);
      console.log('Params', param);
    } else {
      toast.error('Error retrieving response from server.');
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    setOpen(false);
    const profilePayload = {
      method: 'PUT',
      url: '/user/',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      data: {
        email: email,
        username: username,
        first_name: firstName,
        last_name: lastName,
      },
    };
    const response = await axios(profilePayload);
    console.log('Response', response);
    if (response.status === 200) {
      toast.success(`Changed user profile.`);
    } else {
      toast.error('Error retrieving response from server.');
    }
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
                <br></br>
                <Typography paragraph align="left" variant="h4">
                  My Profile
                  <Box className={classes.btnUiDiv}>
                    <Button variant="outlined" onClick={handleClickOpen}>
                      Edit Profile
                    </Button>

                    <Dialog open={open} onClose={handleSave}>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogContent>
                        <TextField
                          autoFocus
                          margin="dense"
                          id="name"
                          label="First Name"
                          type="name"
                          fullWidth
                          variant="standard"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />

                        <TextField
                          margin="dense"
                          id="name"
                          label="Last Name"
                          type="name"
                          fullWidth
                          variant="standard"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </DialogContent>
                      <DialogActions>
                        {/* <Button onClick={handleCancel}>Cancel</Button> */}
                        <Button onClick={handleSave}>Save</Button>
                      </DialogActions>
                    </Dialog>
                  </Box>
                </Typography>
              </Box>

              <TableContainer>
                <Table
                  aria-label="profile-table"
                  style={{ maxHeight: 'auto', wordWrap: 'break-word' }}
                >
                  <TableBody>
                    <TableRow key={0}>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ width: '175px' }}
                      >
                        {' '}
                        <b>First Name</b>{' '}
                      </TableCell>
                      <TableCell align="left" style={{ maxWidth: '304px' }}>
                        {firstName}
                      </TableCell>
                    </TableRow>
                    <TableRow key={1}>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ width: '175px' }}
                      >
                        {' '}
                        <b>Last Name</b>{' '}
                      </TableCell>
                      <TableCell align="left" style={{ maxWidth: '304px' }}>
                        {lastName}
                      </TableCell>
                    </TableRow>
                    <TableRow key={2}>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ width: '175px' }}
                      >
                        {' '}
                        <b>Email</b>{' '}
                      </TableCell>
                      <TableCell align="left" style={{ maxWidth: '304px' }}>
                        {email}
                      </TableCell>
                    </TableRow>
                    <TableRow key={3}>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ width: '175px' }}
                      >
                        {' '}
                        <b>Username</b>{' '}
                      </TableCell>
                      <TableCell align="left" style={{ maxWidth: '304px' }}>
                        {username}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        )}
      </Container>
    </Container>
  );
};

export default UserProfile;
