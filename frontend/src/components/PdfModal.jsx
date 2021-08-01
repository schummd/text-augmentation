import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import PageviewIcon from '@material-ui/icons/Pageview';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: '100%',
    minHeight: '1000px',
  },
  paper: { minWidth: '800px', minHeight: '1000px' },
  titleDivSingleBtn: {
    paddingLeft: '8px',
    paddingRight: '8px',
  },
}));

const PaperComponent = (props) => {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
};

const PdfModal = ({ rawPdf }) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Box className={classes.titleDivSingleBtn}>
        <Button variant="outlined" color="secondary" onClick={handleClickOpen}>
          Vew original PDF <PageviewIcon></PageviewIcon>
        </Button>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        classes={{ paper: classes.paper }}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Uploaded PDF
        </DialogTitle>
        <DialogContent>
          <iframe
            className={classes.root}
            title="pdf-viewer"
            src={URL.createObjectURL(rawPdf)}
            frameborder="0"
          ></iframe>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PdfModal;
