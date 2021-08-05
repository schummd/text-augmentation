import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { StoreContext } from '../utils/store';
import styled from 'styled-components';

//POPPER
import { makeStyles } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import { Box, Button } from '@material-ui/core';
import { toast } from 'react-toastify';

import { getSummary, fetchDefinition } from '../utils/utils';

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
  popper: { zIndex: 9999 },
}));

const CustomEditor = ({ ...children }) => {
  const {
    analysisSummaryRef,
    analysisKeywordsRef,
    setAnalyseTabValue,
    defineRef,
    setUiBtn,
    token,
    fullScreen,
  } = children;

  const context = React.useContext(StoreContext);
  const urlBase = context.urlBase;

  const [editorState, setEditorState] = context.editorState;
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  const classes = useStyles();

  const handleGetSumary = async () => {
    const selectedText = window.getSelection().toString();
    console.log('ST: ', selectedText);
    if (selectedText) {
      const summary = await getSummary(selectedText, token);
      console.log(summary);
      analysisSummaryRef.current.value = summary;
      setPopoverOpen(false);
    } else {
      toast.warn('No text selected for analysis.');
    }
  };

  const handleDefineQuery = async (defineQuery) => {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
      const definition = await fetchDefinition(urlBase, token, selectedText);
      console.log(definition);
      defineRef.current.value = definition;
      setPopoverOpen(false);
    } else {
      toast.warn('No text selected for definition.');
    }
  };

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

  const DraftOuterWrapper =
    fullScreen !== true
      ? styled.div`
          height: 550px;
        `
      : styled.div`
          display: flex;
          justify-content: center;
          width: 100%;
          height: 85vh;
        `;

  const DraftInnerWrapper =
    fullScreen !== true
      ? styled.div`
          height: 550px;
        `
      : styled.div`
          width: 1200px;
          height: 100%;
        `;

  return (
    <div>
      <Popper
        className={classes.popper}
        placement="bottom-start"
        open={popoverOpen}
        anchorEl={anchorEl}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={600}>
            <div>
              <Box className={classes.btnUiWrapper}>
                <Button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setUiBtn('analyse');
                    setAnalyseTabValue(0);
                    handleGetSumary();
                  }}
                  variant="contained"
                  color="primary"
                  size="small"
                >
                  {'SUMMARY'}
                </Button>
                <Button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setUiBtn('analyse');
                    setAnalyseTabValue(1);
                    // handleGetSumary();
                  }}
                  variant="contained"
                  color="secondary"
                  size="small"
                >
                  {'KEYWORDS'}
                </Button>
                <Button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setUiBtn('define');
                    handleDefineQuery();
                  }}
                  variant="contained"
                  color="primary"
                  size="small"
                >
                  {'DEFINE'}
                </Button>

                <Button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setUiBtn('weblinks');
                  }}
                  variant="contained"
                  color="secondary"
                  size="small"
                >
                  {'WEB INFO'}
                </Button>
              </Box>
            </div>
          </Fade>
        )}
      </Popper>
      <DraftOuterWrapper>
        <DraftInnerWrapper>
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
    </div>
  );
};

export default CustomEditor;
