import React from 'react';
import Navigation from '../components/Navigation';
import { Redirect, useHistory } from 'react-router-dom';
import {
  makeStyles,
  Box,
  Container,
  Typography,
  CircularProgress,
  IconButton,
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
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';

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
  btnUiDiv: {
    display: 'inline',
    paddingRight: '4px',
    paddingLeft: '50px',
  },
  cellBtn: {
    display: 'flex',
    width: ' 100%',
    justifyContent: 'flex-start',
  },
  btnText: {
    fontSize: '14px',
    textTransform: 'none',
    justifyContent: 'flex-start',
    width: '100%',
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

const UserNetwork = () => {
  const context = React.useContext(StoreContext);
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const [token, setToken] = React.useState(storedUser.token);
  const [username, setUsername] = React.useState(storedUser.username);
  // const username = context.username;
  // console.log("Context data", token, username)
  const [search, setSearch] = context.search;
  const [usersHeader, setUsersHeader] = context.usersHeader;

  React.useEffect(() => {
    if (token === null) {
      return <Redirect to={{ pathname: '/login' }} />;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [page, setPage] = context.pageState;
  const history = useHistory();
  const [loadingState, setLoadingState] = React.useState('load');
  const [firstName, setFirstName] = React.useState('not provided');
  const [lastName, setLastName] = React.useState('not provided');
  const [email, setEmail] = React.useState('');
  const [rows, setRows] = React.useState([]);
  const [gridPage, setGridPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [pageNumber, setPageNumber] = React.useState(0);
  const [requestToFollow, setRequestToFollow] = React.useState(false);

  const handlePageSizeChange = (params) => {
    setPageSize(params.pageSize);
  };

  const columns = [
    { field: 'id', headerName: 'id', width: 150, hide: true },
    { field: 'first_name', headerName: 'First Name', width: 150 },
    { field: 'last_name', headerName: 'Last Name', width: 150 },
    {
      field: 'username',
      headerName: 'Username',
      width: 150,
      renderCell: (params) => (
        <Box className={classes.cellBtn}>
          <Button
            className={classes.btnText}
            onClick={() => {
              history.push(`/user/${params.row.username}`);
            }}
          >
            {`${params.formattedValue}`}
          </Button>
        </Box>
      ),
    },
    { field: 'email', headerName: 'Email', width: 150 },
    {
      field: 'following',
      headerName: 'Following',
      width: 150,
      renderCell: (params) =>
        params.value ? (
          <Box className={classes.cellBtn}>
            <IconButton>
              <CheckCircleIcon color="primary" />
            </IconButton>
          </Box>
        ) : (
          <Box className={classes.cellBtn}>
            <IconButton>
              <CheckCircleOutlineIcon color="primary" />
            </IconButton>
          </Box>
        ),
    },
  ];

  React.useEffect(() => {
    setPage('/user/network');
    async function setupHome() {
      setLoadingState('loading');
      console.log('Profile page', username, token);

      // getting all users information
      try {
        const payload = {
          method: 'GET',
          url: '/user/' + username + '/network',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Authorization: ${token}`,
          },
        };
        console.log('Payload', payload);
        const ulist = await axios(payload);
        const userlist = ulist.data;
        console.log('User List', userlist.data);
        // if (resData.status === 'success') {
        if (userlist.data.length > 0) {
          // toast.success(`Retrieved User information from server.`);
          setRows(userlist.data);
          console.log('User List', rows);
          setRequestToFollow(false);
          setLoadingState('done');
        } else {
          toast.warn(`${userlist.message}`);
        }
      } catch (error) {
        toast.error('Error retrieving User data from server.');
      }
    }

    setupHome();
  }, [requestToFollow]); // eslint-disable-line react-hooks/exhaustive-deps

  // search for users
  const handleUserSearch = async (e) => {
    setSearch(true);
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
          // params: {"firstname": {firstName},
          //          "lastname": {lastName},
          //          "username": {usersName},
          //          "email": {email}
          //         }
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
        setRows(resData.data);
        setUsersHeader('Search Results');
        console.log(rows);
        setLoadingState('done');
      } catch (error) {
        toast.error('Error retrieving Reads from server.');
      }
    }
  };

  const [openEditProfile, setEditProfileOpen] = React.useState(false);
  const handleClickOpen = () => {
    setEditProfileOpen(true);
  };
  const handleCancel = () => {
    setEditProfileOpen(false);
  };

  // follow or unfollow another user
  const handleCellClick = async (param, event) => {
    console.log(param);
    console.log(event);
    if (param.colDef.field === 'username') {
      console.log('nav to user profile');
      // history.push(`/user/${param.row.username}`);
    } else if (param.colDef.field === 'following') {
      // handling change in following status
      const networkUsername = param.row.username;
      // history.push(`user/${networkUsername}`)
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
        setRequestToFollow(true);
        console.log('Params', param);
      } else {
        toast.error('Error retrieving response from server.');
      }
    }
    event.stopPropagation();
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
                  Users
                  {/* <Box position="relative" 
                  display="inline-block"
                  padding="30px"
                  > */}
                </Typography>
                <Box className={classes.btnUiDiv}>
                  <Tooltip title="Edit Profile">
                    <Button
                      variant="outlined"
                      onClick={() => {
                        handleClickOpen();
                      }}
                    >
                      Search Users
                    </Button>
                  </Tooltip>
                  <Dialog open={openEditProfile} onClose={handleCancel}>
                    <DialogTitle>Search Users</DialogTitle>
                    <DialogContent>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="First Name"
                        type="name"
                        fullWidth
                        variant="standard"
                        // value={firstName}
                        // onChange={(e) => setFirstName(e.target.value)}
                      />
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Last Name"
                        type="name"
                        fullWidth
                        variant="standard"
                        // value={lastName}
                        // onChange={(e) => setFirstName(e.target.value)}
                      />
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="username"
                        type="name"
                        fullWidth
                        variant="standard"
                        // value={usersName}
                        // onChange={(e) => setFirstName(e.target.value)}
                      />
                      <TextField
                        margin="dense"
                        id="name"
                        label="Email"
                        type="name"
                        fullWidth
                        variant="standard"
                        // value={email}
                        // onChange={(e) => setLastName(e.target.value)}
                      />
                    </DialogContent>
                    <DialogActions>
                      {/* <Button onClick={handleCancel}>Cancel</Button> */}
                      {/* <Button onClick={handleSave}>Save</Button> */}
                    </DialogActions>
                  </Dialog>
                </Box>

                <br></br>
                {/* </Box> */}
              </Box>
              <div style={{ height: 400, width: '95%', marginLeft: 40 }}>
                <div style={{ display: 'flex', height: '100%' }}>
                  <div style={{ flexGrow: 1 }}>
                    <DataGrid
                      page={pageNumber}
                      onPageChange={(params) => {
                        setPageNumber(params.pageNumber);
                      }}
                      onCellClick={handleCellClick}
                      // autoHeight
                      rows={rows}
                      columns={columns}
                      pagination
                      pageSize={pageSize}
                      onPageSizeChange={handlePageSizeChange}
                      rowsPerPageOptions={[5, 10, 20]}
                      rowCount={rows.length}
                    />
                  </div>
                </div>
              </div>
            </Box>
            <br />
            <br />
          </Box>
        )}
      </Container>
    </Container>
  );
};

export default UserNetwork;
