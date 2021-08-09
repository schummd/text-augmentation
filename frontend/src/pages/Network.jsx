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
  titleAndBtnDiv: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1em',
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
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',    
    "& .MuiButton-label": {
      overflow: 'hidden',
    }    
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
  usersNotFoundDiv: {
    margin: '2em 0em',
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

  const [firstNameSearch, setFirstNameSearch] = React.useState()
  const [lastNameSearch, setLastNameSearch] = React.useState()
  const [usernameSearch, setUsernameSearch] = React.useState()
  const [emailSearch, setEmailSearch] = React.useState()
  const [openSearch, setOpenSearch] = React.useState(false);

  const handlePageSizeChange = (params) => {
    setPageSize(params.pageSize);
  };

  React.useEffect(() => {
    if (token === null) {
      return <Redirect to={{ pathname: '/login' }} />;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  const columns = [
    { field: 'id', headerName: 'id', width: 150, hide: true },
    { field: 'first_name', headerName: 'First Name', width: 200 },
    { field: 'last_name', headerName: 'Last Name', width: 200 },
    {
      field: 'username',
      headerName: 'Username',
      width: 300,
      renderCell: (params) => (
        <Box className={classes.cellBtn}>
          <Tooltip title={`Go to ${params.row.username}'s Profile`}>
            <Button
              color="primary"
              variant="outlined"
              className={classes.btnText}
              onClick={() => {
                history.push(`/user/${params.row.username}`);
              }}
            >
              {`${params.formattedValue}`}
            </Button>
          </Tooltip>
        </Box>
      ),
    },
    { field: 'email', headerName: 'Email', width: 275 },
    {
      field: 'following',
      headerName: 'Following',
      width: 140,
      renderCell: (params) =>
        params.value ? (
          <Box className={classes.cellBtn}>
            <Tooltip title={`Unfollow ${params.row.username}`}>
              <IconButton>
                <CheckCircleIcon color="primary" />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Box className={classes.cellBtn}>
            <Tooltip title={`Follow ${params.row.username}`}>
              <IconButton>
                <CheckCircleOutlineIcon color="primary" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
    },
  ];

  // setting up users
  React.useEffect(() => {
    setPage('/user/network');
    if (!search) {
      setupHome();
    }
  }, [requestToFollow, search]); // eslint-disable-line react-hooks/exhaustive-deps

  async function setupHome() {
    setLoadingState('loading');
    console.log('Profile page', username, token);

    // getting all users information
    try {
      const payload = {
        method: 'GET',
        url: `/user/${username}/network`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Authorization: ${token}`,
        },
      };
      console.log('Payload', payload);
      const ulist = await axios(payload);
      const userlist = ulist.data;
      console.log('User List', userlist.data);
      if (userlist.data.length > 0) {
        setRows(userlist.data);
        console.log('User List', rows);
        setRequestToFollow(false);
      }
      setLoadingState('done');
    } catch (error) {
      toast.error('Error retrieving User data from server.');
    }
  }

  // search for users
  const handleUserSearch = async (e) => {
    setSearch(true);
    setLoadingState('loading');
    console.log(firstNameSearch)
    try {
      const payload = {
        method: 'GET',
        url: `/user/${username}/usersearch`,
        headers: {
          'Content-Type': 'application/json',
        },
        params: {"firstname": firstNameSearch,
                  "lastname": lastNameSearch,
                  "username": usernameSearch,
                  "email": emailSearch
                }
      };
      console.log(payload);
      const res = await axios(payload);
      const resData = res.data;
      console.log("Request returned", resData);

      if (resData.length > 0) {
        console.log('success');
        setUsersHeader('Search results')
        setRows(resData);

      } else {
        setUsersHeader('Search results')
        setRows([]);
      }
      setFirstNameSearch()
      setLastNameSearch()
      setUsernameSearch()
      setEmailSearch()
      setUsersHeader('Search Results');
      console.log(rows);
      setLoadingState('done');
      setOpenSearch(false);
    } catch (error) {
      toast.error('Error retrieving Reads from server.');
    }
  }
 
  const handleClickOpen = () => {
    setOpenSearch(true);
  };
  const handleCancel = () => {
    setOpenSearch(false);
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
        {
          loadingState !== 'done' && (
          <div>
            <CircularProgress color="primary" />
          </div>
        )}
        {
          loadingState === 'done' && (
          <Box className={classes.containerDiv}>
            <Box className={classes.titleDiv}>
              <Box className={classes.titleAndBtnDiv}>
                <Typography paragraph align="left" variant="h4">
                  {usersHeader}
                </Typography>
                {
                  rows.length > 0 &&
                  <Box className={classes.btnUiDiv}>
                    <Tooltip title="Search Users" compoonen={'span'}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          handleClickOpen();
                        }}
                      >
                        Search Users
                      </Button>
                    </Tooltip>
                    <Dialog open={openSearch} 
                      maxWidth='xs'
                      onClose={handleCancel}
                    >
                      <DialogTitle>
                        Search for Users
                      </DialogTitle>
                      <DialogContent>
                        <TextField
                          autoFocus
                          margin="dense"
                          id="firstname"
                          label="First Name"
                          type="firstname"
                          fullWidth
                          variant="standard"
                          onChange={(e) => setFirstNameSearch(e.target.value)}
                        />
                        <TextField
                          margin="dense"
                          id="lastname"
                          label="Last Name"
                          type="lastname"
                          fullWidth
                          variant="standard"
                          onChange={(e) => setLastNameSearch(e.target.value)}
                        />
                        <TextField
                          margin="dense"
                          id="username"
                          label="Username"
                          type="username"
                          fullWidth
                          variant="standard"
                          onChange={(e) => setUsernameSearch(e.target.value)}
                        />
                        <TextField
                          margin="dense"
                          id="email"
                          label="Email"
                          type="email"
                          fullWidth
                          variant="standard"
                          onChange={(e) => setEmailSearch(e.target.value)}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Tooltip title="Cancel Search">
                          <Button onClick={handleCancel}>
                            Cancel
                          </Button>
                        </Tooltip>
                        <Tooltip title="Search">
                          <Button onClick={handleUserSearch}>
                            Search
                          </Button>
                        </Tooltip>
                      </DialogActions>
                    </Dialog>
                  </Box>
                }
              </Box>
              {
                rows.length > 0 &&
                <div style={{ height: 400, width: '95%', marginLeft: 40 }}>
                  <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>
                      <DataGrid
                        page={pageNumber}
                        onPageChange={(params) => {
                          setPageNumber(params.pageNumber);
                        }}
                        onCellClick={handleCellClick}
                        autoHeight
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
              }
              {
                rows.length === 0 &&
                <Box className={classes.usersNotFoundDiv}>
                  <Typography className={classes.usersNotFoundText}>
                    {`There are no other users currently registered on ReadMore.`}
                  </Typography>
                </Box>
              }              
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
