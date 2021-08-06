import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { StoreContext } from '../utils/store';
import styled from 'styled-components';

//POPPER
import { makeStyles } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import { Box, Button, IconButton, Tooltip } from '@material-ui/core';
import { toast } from 'react-toastify';
import DeleteIcon from '@material-ui/icons/Delete';

import { getSummary } from '../utils/utils';
import { ref } from 'yup';

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
  paper: {
    opacity: 1,
    backgroundColor: 'red',
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
}));

const useFocus = () => {
  const htmlElRef = React.useRef(null);
  const setFocus = () => {
    htmlElRef.current && htmlElRef.current.focus();
  };

  return [htmlElRef, setFocus];
};

const CustomEditor = ({ ...children }) => {
  const { notesRef, token, fullScreen } = children;
  const context = React.useContext(StoreContext);

  const [editorState, setEditorState] = context.editorState;
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const buttonRef = React.useRef(false);

  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  const classes = useStyles();

  React.useEffect(() => {
    const selection = window.getSelection();
    console.log('ES: ', editorState);

    // Resets when the selection has a length of 0
    if (!selection || selection.anchorOffset === selection.focusOffset) {
      setPopoverOpen(false);
      return;
    }

    const getBoundingClientRect = () =>
      selection.getRangeAt(0).getBoundingClientRect();

    setPopoverOpen(true);
    setAnchorEl({
      clientWidth: getBoundingClientRect().width,
      clientHeight: getBoundingClientRect().height,
      getBoundingClientRect,
    });
  }, [editorState]);

  React.useLayoutEffect(() => {
    console.log('BR', buttonRef);
    if (buttonRef.current) {
      console.log('FX');
      buttonRef.current.focus();
    }
  }, [buttonRef]);

  const id = popoverOpen ? 'faked-reference-popper' : undefined;

  const handleGetSumary = async () => {
    const selectedText = document.getSelection().toString();
    if (selectedText) {
      const summary = await getSummary(selectedText, token);
      console.log(summary);
      notesRef.current.value = summary;
    } else {
      toast.warn('No text selected for analysis.');
    }
  };

  const DraftOuterWrapper = fullScreen !== true
    ? styled.div`
        height: 550px;
      `
    : styled.div`
        display: flex;
        justify-content: center;
        width: 100%;
        height: 85vh;
      `;

  const DraftInnerWrapper = fullScreen !== true
    ? styled.div`
        height: 550px;
      `
    : styled.div`
        width: 1200px;
        height: 100%;
      `;

  return (
    <DraftOuterWrapper>
      <DraftInnerWrapper>
        <Popper
          id={id}
          open={popoverOpen}
          anchorEl={anchorEl}
          transition
          placement="bottom-start"
        >
          <div className="divWithButton" tabindex="-1" ref={buttonRef}>
            <Button variant="contained" color="primary">
              {id === 'new' ? 'Save New Read' : 'Analyse'}
            </Button>
          </div>
        </Popper>
        <Editor
          editorState={editorState}
          onEditorStateChange={handleEditorChange}
          wrapperStyle={{
            border: '1px solid gray',
            padding: '1rem',
            overflow: 'hidden',
            height: '100%',
          }}
          editorStyle={
            fullScreen !== true
              ? {
                backgroundColor: '#fff',
                border: '1px solid gray',
                padding: '1rem',
                overflow: 'auto',
                height: '84%',
              }
              : {
                backgroundColor: '#fff',
                border: '1px solid gray',
                padding: '0.75rem',
                overflow: 'auto',
                height: '89%',
              }
          }
          toolbarStyle={{
            border: '1px solid gray',
          }}
        />
      </DraftInnerWrapper>
    </DraftOuterWrapper>
  );
};

export default CustomEditor;
