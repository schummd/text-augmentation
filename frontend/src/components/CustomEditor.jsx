import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { StoreContext } from '../utils/store';
import styled from 'styled-components';

//POPPER
import { makeStyles } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import { Box, Button, Link, Paper, Typography } from '@material-ui/core';
import { toast } from 'react-toastify';
import * as youtubeSearch from 'youtube-search';

import { getSummary, fetchDefinition, getKeywords } from '../utils/utils';

const DraftOuterWrapper = styled.div`
  height: 550px;
`;

const DraftInnerWrapper = styled.div`
  height: 550px;
`;

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
    backgroundColor: '#5461AA',
    color: '#fff',
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
  btnSummary: {
    backgroundColor: '#505160',
    color: '#fff',
    marginRight: '2px',
  },
  btnKeywords: {
    backgroundColor: '#68829E',
    color: '#fff',
    marginRight: '2px',
  },
  btnDefine: {
    backgroundColor: '#AEBD38',
    color: '#fff',
    marginRight: '2px',
  },
  btnWebInfo: {
    backgroundColor: '#598234',
    color: '#fff',
    marginRight: '2px',
  },
  btnUiWrapper: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
  },

  popper: { zIndex: 9999 },
}));

const CustomEditor = ({ ...children }) => {
  const {
    setAnalysisSummary,
    setAnalysisKeywords,
    setAnalyseTabValue,
    defineRef,
    setUiBtn,
    token,
    setSearchTerm,
  } = children;

  const context = React.useContext(StoreContext);
  const urlBase = context.urlBase;

  const [editorState, setEditorState] = context.editorState;
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [defineOpen, setDefineOpen] = React.useState(false);
  const [definition, setDefinition] = React.useState('');
  const [isSingleWordSelected, setIsSingleWordSelected] = React.useState(false);

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
      setAnalysisSummary(summary);
      setPopoverOpen(false);
    } else {
      toast.warn('No text selected for analysis.');
    }
  };

  const handleGetKeywords = async (text) => {
    const selectedText = window.getSelection().toString();
    console.log('ST: ', selectedText);
    if (selectedText) {
      const keywords = await getKeywords(selectedText, token);
      console.log(keywords);
      const formattedKeywords = (
        <div>
          {keywords.map((keyword) => (
            <p>
              <Link
                onClick={() => {
                  setSearchTerm(keyword);
                  setUiBtn('weblinks');
                }}
                component="button"
              >
                {keyword}
              </Link>
            </p>
          ))}
        </div>
      );
      setAnalysisKeywords(formattedKeywords);
      setPopoverOpen(false);
    } else {
      toast.warn('No text selected for analysis.');
    }
  };

  const handleDefineQuery = async (defineQuery) => {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
      const definitionResponse = await fetchDefinition(
        urlBase,
        token,
        selectedText
      );
      console.log(definition);
      setDefinition(definitionResponse);
      setPopoverOpen(false);
      setDefineOpen(true);
    } else {
      toast.warn('No text selected for definition.');
    }
  };

  React.useEffect(() => {
    const selection = window.getSelection();
    const numWords = selection.toString().trim().split(' ');
    console.log(numWords);
    if (numWords.length === 1) setIsSingleWordSelected(true);
    console.log('ES: ', editorState);

    // Resets when the selection has a length of 0
    if (!selection || selection.anchorOffset === selection.focusOffset) {
      setPopoverOpen(false);
      setIsSingleWordSelected(false);
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

  return (
    <div>
      <Popper
        className={classes.popper}
        placement="bottom-right"
        open={defineOpen}
        anchorEl={anchorEl}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={600}>
            <Paper>
              <Typography
                onMouseLeave={() => setDefineOpen(false)}
                className={classes.typography}
              >
                {definition}
              </Typography>
            </Paper>
          </Fade>
        )}
      </Popper>
      <Popper
        className={classes.popper}
        placement="top-start"
        open={popoverOpen}
        anchorEl={anchorEl}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={600}>
            <div>
              <Box className={classes.btnUiWrapper}>
                {!isSingleWordSelected && (
                  <Button
                    className={classes.btnSummary}
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
                )}
                {!isSingleWordSelected && (
                  <Button
                    className={classes.btnKeywords}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setUiBtn('analyse');
                      setAnalyseTabValue(1);
                      handleGetKeywords();
                    }}
                    variant="contained"
                    color="primary"
                    size="small"
                  >
                    {'KEYWORDS'}
                  </Button>
                )}
                {isSingleWordSelected && (
                  <Button
                    className={classes.btnDefine}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleDefineQuery();
                    }}
                    variant="contained"
                    color="primary"
                    size="small"
                  >
                    {'DEFINE'}
                  </Button>
                )}

                <Button
                  className={classes.btnWebInfo}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setUiBtn('weblinks');
                  }}
                  variant="contained"
                  color="primary"
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
            editorStyle={{
              backgroundColor: '#fff',
              border: '1px solid gray',
              padding: '1rem',
              overflow: 'auto',
              height: '84%',
            }}
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
