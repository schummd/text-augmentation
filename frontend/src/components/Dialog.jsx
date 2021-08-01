import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { useForm } from 'react-hook-form';

import { readFile, parsedPdfToHtml, postToScienceParse } from '../utils/utils';
import { EditorState, convertFromHTML, ContentState } from 'draft-js';

import { StoreContext } from '../utils/store';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing(3),
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

const createEditorStateFromScienceParse = (data, formState) => {
  const markup = parsedPdfToHtml(data, formState);
  const blocksFromHTML = convertFromHTML(markup);
  const contentStateFromBlocks = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap
  );
  const newState = EditorState.createWithContent(contentStateFromBlocks);
  return newState;
};

const UploadDialog = ({ setParseLoad }) => {
  // Checkboxes
  /////////////////////////////////////////////////////////////////////////////
  const classes = useStyles();

  const fileRef = React.useRef();
  const [pdf, setPdf] = React.useState(false);

  const [formState, setFormState] = React.useState({
    title: true,
    abstract: true,
    authors: true,
    body: true,
    references: true,
  });
  /////////////////////////////////////////////////////////////////////////////

  const context = React.useContext(StoreContext);
  const [, setEditorState] = context.editorState;
  const { register, handleSubmit } = useForm();

  const uploadSubmit = async (d) => {
    setParseLoad('load');
    const uploadedFile = d.uploadedPDF[0];
    const dataUrl = await readFile(uploadedFile);
    const rawBase64Data = dataUrl.split(',')[1];
    const res = await postToScienceParse(rawBase64Data);
    if (!res) {
      setParseLoad('done');
      return;
    }
    const { data } = res;
    const newState = createEditorStateFromScienceParse(data, formState);
    setEditorState(newState);
    setParseLoad('done');
  };

  const handleChange = (event) => {
    setFormState({ ...formState, [event.target.name]: event.target.checked });
  };

  const { title, abstract, authors, body, references } = formState;

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Upload PDF
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Upload a PDF
        </DialogTitle>
        <DialogContent>
          <div className={classes.root}>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">
                Select sections to extract
              </FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={title}
                      onChange={handleChange}
                      name="title"
                    />
                  }
                  label="Title"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={abstract}
                      onChange={handleChange}
                      name="abstract"
                    />
                  }
                  label="Abstract"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={authors}
                      onChange={handleChange}
                      name="authors"
                    />
                  }
                  label="Authors"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={body}
                      onChange={handleChange}
                      name="body"
                    />
                  }
                  label="Body"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={references}
                      onChange={handleChange}
                      name="references"
                    />
                  }
                  label="References"
                />
              </FormGroup>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Cancel
          </Button>
          <form
            onSubmit={handleSubmit(uploadSubmit)}
            className={classes.titleDivMultipleBtn}
          >
            <input
              accept="application/pdf"
              id="upload-button"
              multiple
              type="file"
              name="pdfFile"
              ref={fileRef}
              {...register('uploadedPDF', { required: true })}
              onChange={(e) => setPdf(console.log(e.target.files[0].name))}
            />
            <Button type="submit" onClick={handleClose} color="primary">
              Process
            </Button>
          </form>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UploadDialog;
