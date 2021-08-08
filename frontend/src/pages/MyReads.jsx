import React from 'react';
import { StoreContext } from '../utils/store';
import Navigation from '../components/Navigation';
import { useHistory } from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import DeleteDialog from '../components/DeleteDialog';
import {
  makeStyles,
  Box,
  Container,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
  Button,
} from '@material-ui/core';
import axios from 'axios';
import { toast } from 'react-toastify';

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
  listDiv: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    margin: 'auto',
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
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

const MyReads = () => {
  const context = React.useContext(StoreContext);
  const token = context.token[0];
  const username = context.username[0];
  const [myReads, setMyReads] = context.myReads;
  const [page, setPage] = context.pageState;
  const [loadingState, setLoadingState] = React.useState('load');
  const [deletedRead, setDeletedRead] = React.useState(false);
  const history = useHistory();
  const [deletionId, setDeletionId] = React.useState('');
  const [pageSize, setPageSize] = React.useState(20);
  const [pageNumber, setPageNumber] = React.useState(0);
  const handlePageSizeChange = (params) => {
    setPageSize(params.pageSize);
  };
  // defining columns for the grid
  const columns = [
    { field: 'id', headerName: 'Id', width: 150, hide: true },
    { field: 'text_id', headerName: 'Text Id', width: 150, hide: true },
    {
      field: 'text_title', headerName: 'Title', width: 800,
      renderCell: (params) =>
        <Box className={classes.cellBtn}>
          <Tooltip title="Go to Read">
            <Button
              className={classes.btnText}
            >
              {`${params.formattedValue}`}
            </Button>
          </Tooltip>
        </Box>
    },
    { field: 'text_created', headerName: 'Created At', width: 200 },
    { field: 'delete_text', headerName: 'Delete', width: 150,
    renderCell: (params) =>
      (
        <Box className={classes.cellBtn}>
          <Tooltip title="Delete this Read">
            <IconButton
              onClick={()=>{
                console.log('params to delete:', params);
                setDeletionId(params.id);
                handleClickDeleteRead();
              }}
            >
              <DeleteForeverIcon color="secondary" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    },
  ];
  const [rows, setRows] = React.useState([]);

  // fetching default articles
  React.useEffect(() => {
    setPage('/myreads');
    setLoadingState('loading');
    const getArticles = async () => {
      try {
        const payload = {
          method: 'GET',
          url: `/text/fetchall/${username}`,
          headers: {
            'Content-Type': 'application/json',
          },
        };
        const res = await axios(payload);
        console.log('res is', res)
        const resData = res.data;
        console.log('resdata is', resData);
        if (resData.status !== 'success') {
          toast.warn(`${resData.message}`);
        }
        const { data } = resData;
        setMyReads(data);
        await setRows(data);
        setLoadingState('done');
      } catch (error) {
        toast.error('Error retrieving Reads from server');
      }
    };
    getArticles();
  }, [deletedRead]); // eslint-disable-line react-hooks/exhaustive-deps
  
  const handleRowClick = (param, event) => {
    history.push(`/articles/${param.row.text_id}`);
  };

  const handleCellClick = (param, event) => {
    console.log(param);
    console.log(event);
    // handling clicking on an article
    if (param.colDef.field === 'text_title') {
      history.push(`/articles/${param.row.text_id}`);
    }
    event.stopPropagation();
  };
  // managing article deletion
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const handleClickDeleteRead = () => {
    setOpenDeleteDialog(true);
  };
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeletedRead(!deletedRead);
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
                  My Reads
                </Typography>
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
                        onRowClick={handleRowClick}
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
              <DeleteDialog
                open={openDeleteDialog}
                handleClose={handleCloseDeleteDialog}
                page={page}
                deleteUuid={deletionId}
              />
            </Box>
            <br />
            <br />
          </Box>
        )}
      </Container>
    </Container>
  );
};

export default MyReads;
