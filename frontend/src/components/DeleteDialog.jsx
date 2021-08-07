import React from 'react';
import { StoreContext } from '../utils/store';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from '@material-ui/core';
import axios from 'axios';
import { toast } from 'react-toastify';

// A deletion dialog which allows the user a to confirm their delete request
const DeleteReadDialog = ({ open, handleClose, page, deleteUuid }) => {
  const context = React.useContext(StoreContext);
  const token = context.token[0];
  const urlBase = context.urlBase;
  const history = useHistory();
  console.log('deleteuuid is', deleteUuid)
  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle id="delete-title">{`Delete Your Read`}</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-description">
          {`Are you sure you want to delete this Read?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Tooltip title="Confirm">
          <Button
            color="secondary"
            onClick={async () => {
              if (deleteUuid !== 'new') {
                await axios({
                  method: 'DELETE',
                  url: `${urlBase}/text/${deleteUuid}`,
                  headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    Authorization: `${token}`,
                  },
                })
                  .then(() => {
                    handleClose();
                    if (page === '/articles/') {
                      history.push('/myreads');
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                    toast.error('Failed to delete Read.');
                    handleClose();
                    if (page === '/articles/') {
                      history.push('/myreads');
                    }
                  })
              } else {
                toast.error('Save the new Read before deleting');
                handleClose();
              }
            }}
          >
            Delete
          </Button>
        </Tooltip>
        <Tooltip title="Cancel">
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </Tooltip>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteReadDialog;
