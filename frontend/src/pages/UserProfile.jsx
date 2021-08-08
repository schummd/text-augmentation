import React from 'react';
import { StoreContext } from '../utils/store';
import Navigation from '../components/Navigation';
import {
  Redirect,
  useParams,
  useHistory,
} from 'react-router-dom';
import {
  makeStyles,
  Box,
  Container,
  Button,
  TextField,
  Typography,
  CircularProgress,
  FormControl,
  Tooltip,
  Icon,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import axios from 'axios';
import { toast } from 'react-toastify';


const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
    display: 'inline-block',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'gray',
    minHeight: '100vh',
    width: '100%',
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
  titleAndBtnDiv: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnUiDiv: {
    display: 'inline',
    paddingRight: '4px',
    paddingLeft: '50px',
  },
  tableContainer: {
    marginBottom: '1em',
  },
  articlesContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  cellBtn: {
    display: 'flex',
    width:' 100%',
    justifyContent: 'flex-start',
  },
  btnText: {
    fontSize: '14px',
    textTransform: 'none',
    justifyContent: 'flex-start',
    width: '100%',
  },  
}));

const UserProfile = () => {
  const context = React.useContext(StoreContext);
  // const storedUser = JSON.parse(localStorage.getItem('user'));
  // const [token, setToken] = React.useState(storedUser.token);
  // const [username, setUsername] = React.useState(storedUser.username);
  const token = context.token[0];
  const username = context.username[0];

  React.useEffect(() => {
    if (token === null) {
      return <Redirect to={{ pathname: '/login' }} />;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [page, setPage] = context.pageState;
  const history = useHistory();
  const [loadingState, setLoadingState] = React.useState('loading');
  const params = useParams();
  const currentProfileUsername = params.username;
  const [firstName, setFirstName] = React.useState('not provided');
  const [lastName, setLastName] = React.useState('not provided');
  const [email, setEmail] = React.useState('');
  const [userArticles, setUserArticles] = React.useState([]);
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    setPage(`/user/${currentProfileUsername}`);
    async function setupHome() {
      setLoadingState('loading');
      // getting user information
      try {
        const payload = {
          method: 'GET',
          url: `/user/${currentProfileUsername}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Authorization: ${token}`,
          },
        };
        console.log('Payload', payload);
        const res = await axios(payload);
        const resData = res.data;
        console.log('ResData', resData);

        setFirstName(resData.first_name);
        setLastName(resData.last_name);
        setEmail(resData.email);
        setLoadingState('done');
      } catch (error) {
        toast.error('Error retrieving User data from server.');
      }
      if (currentProfileUsername !== username) {
        try {
          const payload = {
            method: 'GET',
            url: `/text/fetchall/${currentProfileUsername}`,
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

          console.log('userArticles are', data);

          if (data.length > 0) {
            setUserArticles(data);
            setRows(data);
          }
        } catch (error) {
          toast.error('Error retrieving Reads from server.');
        }        
      }
    }
    setupHome();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCellClick = async (param, event) => {
    // handling clicking on an article
    if (param.colDef.field === 'text_title') {
      history.push(`/articles/${param.row.text_id}`);
    }
    event.stopPropagation();
  };

  const [openEditProfile, setEditProfileOpen] = React.useState(false);
  const handleClickOpen = () => {
    setEditProfileOpen(true);
  };
  const handleCancel = () => {
    setEditProfileOpen(false);
  };

  const handleSave = async () => {
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
    handleCancel();
  };

  const [pageSize, setPageSize] = React.useState(10);
  const [pageNumber, setPageNumber] = React.useState(0);
  const handlePageSizeChange = (params) => {
    setPageSize(params.pageSize);
  };

  const columns = [
    { field: 'id', headerName: 'Id', width: 150, hide: true },
    { field: 'text_id', headerName: 'Text Id', width: 150, hide: true },
    {
      field: 'text_title', headerName: 'Title', width: 800,
      renderCell: (params) =>
        <Box className={classes.cellBtn}>
          <Tooltip title="Go to Read">
            <Button
              variant="outlined"
              className={classes.btnText}
            >
              {`${params.formattedValue}`}
            </Button>
          </Tooltip>
        </Box>
    },
    { field: 'text_created', headerName: 'Created At', width: 200 },
  ];
  
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
              <Box className={classes.titleAndBtnDiv}>
                <Typography paragraph align="left" variant="h4">
                  {
                    currentProfileUsername === username
                      ? 'My Profile'
                      : 'User Profile'
                  }
                </Typography>
                {
                  currentProfileUsername === username &&
                  <Box className={classes.btnUiDiv}>
                    <Tooltip title="Edit Profile">
                      <Button
                        variant="outlined"
                        onClick={() => {
                          if (currentProfileUsername === username) {
                            handleClickOpen();
                          } else {
                            toast.error('May only change your own Profile');
                          }
                        }}
                      >
                        Edit Profile
                      </Button>
                    </Tooltip>
                    <Dialog
                      open={openEditProfile}
                      onClose={handleCancel}
                    >
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
                        <Button onClick={handleCancel}>Cancel</Button>
                        <Button onClick={handleSave}>Save</Button>
                      </DialogActions>
                    </Dialog>
                  </Box>
                }
              </Box>

              <TableContainer className={classes.tableContainer}>
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
                        {currentProfileUsername}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              {
                currentProfileUsername !== username &&
                userArticles.length === 0 &&
                <Box>
                  <Box className={classes.titleDiv}>
                    <Typography paragraph align="left" variant="h6" color="textSecondary">
                      {'User Reads'}
                    </Typography>
                  </Box>
                  <Typography>
                    {`${currentProfileUsername} has no Reads.`}
                  </Typography>
                </Box>
              }            
              {
                currentProfileUsername !== username &&
                userArticles.length > 0 &&
                <Box className={classes.articlesContainer}>
                  <Box className={classes.titleDiv}>
                    <Typography paragraph align="left" variant="h6" color="textSecondary">
                      {'User Reads'}
                    </Typography>
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
              }
            </Box>
          </Box>
        )}
      </Container>
    </Container>
  );
};

export default UserProfile;
