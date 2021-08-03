import React from 'react';
import { StoreContext } from '../utils/store';
import { convertToRaw, convertFromRaw, EditorState } from 'draft-js';
import {
  createTextObject,
  fetchDefinition,
  getSummary,
  getArticles,
  dataUrlToFile,
} from '../utils/utils';
import Navigation from '../components/Navigation';
import PdfModal from '../components/PdfModal';
import MyAccordian from '../components/MyAccordian';

import { Redirect, useParams, useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import {
  makeStyles,
  Box,
  Container,
  Button,
  Tooltip,
  Typography,
  CircularProgress,
  TextField,
  IconButton,
  Grid,
  InputAdornment,
} from '@material-ui/core';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import CustomEditor from '../components/CustomEditor';
import Skeleton from '@material-ui/lab/Skeleton';
import TwitterIcon from '@material-ui/icons/Twitter';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import { toast } from 'react-toastify';
import UploadDialog from '../components/Dialog';

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
  outerWidth: {
    width: '100%',
  },
  containerDiv: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-start',
    alignContent: 'flex-start',
    width: '100%',
  },
  titleDiv: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    margin: theme.spacing(2),
  },
  titleSubDiv: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
  },
  titleText: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  titleDivBtns: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  titleDivSingleBtn: {
    paddingLeft: '8px',
    paddingRight: '8px',
  },
  titleDivMultipleBtn: {
    display: 'flex',
  },
  btnText: {
    fontSize: '14px',
    textTransform: 'capitalize',
    borderRadius: 16,
  },
  containerUi: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  uiInteractionWrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '70%',
    height: '100%',
    margin: theme.spacing(0.5),
  },
  uiDisplayWrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '30%',
    height: '100%',
    margin: theme.spacing(0.5),
  },
  uiInputText: {
    width: '100%',
    height: '100%',
    margin: theme.spacing(1),
  },
  interactionBtnsDiv: {
    display: 'flex',
    width: '100%',
    margin: theme.spacing(1),
  },
  interactionBtnsGrid: {
    margin: theme.spacing(1),
  },
  uiDisplayBtnsWrapper: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    margin: theme.spacing(1),
    paddingBottom: '2px',
  },
  btnUiWrapper: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
  },
  btnUiDiv: {
    display: 'flex',
    paddingRight: '4px',
    paddingLeft: '4px',
  },
  btnUi: {
    fontSize: '14px',
    textTransform: 'capitalize',
  },
  btnUiClicked: {
    fontSize: '14px',
    textTransform: 'capitalize',
    backgroundColor: '#C0C0C0',
  },
  btnHighlightDiv: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
  },
  btnHighlight: {
    borderColor: 'gray',
    border: '1px solid gray',
  },
  btnHighlightClicked: {
    backgroundColor: '#C0C0C0',
    borderColor: 'gray',
    border: '1px solid gray',
    '&:hover': {
      backgroundColor: '#C0C0C0',
    },
  },
  displayTextfield: {
    width: '100%',
    height: '100%',
    margin: theme.spacing(1),
    color: 'black',
  },
  backspaceIconBtn: {
    padding: 0,
  },
  twitterIconBtn: {
    padding: 0,
  },
  btnUploadDiv: {
    margin: '0em 0.25em',
  },
}));

const Article = () => {
  const context = React.useContext(StoreContext);
  const [token, setToken] = context.token;
  const urlBase = context.urlBase;
  const [username, setUsername] = context.username;
  const [editorState, setEditorState] = context.editorState;
  const [singularRead, setSingularRead] = context.singularRead;
  const [myReads, setMyReads] = context.myReads;
  const { blankEditorState } = context;

  React.useEffect(() => {
    if (token === null) {
      return <Redirect to={{ pathname: '/login' }} />;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [uiBtn, setUiBtn] = React.useState('define');

  const [defineQuery, setDefineQuery] = React.useState('');
  const [twitterQuery, setTwitterQuery] = React.useState('');
  const [definitionVal, setDefinitionVal] = React.useState('');

  const [rawPdf, setRawPdf] = React.useState(null);
  const [rawDataUrl, setRawDataUrl] = React.useState(null);

  const handleChangeDefineQuery = async (event) => {
    await setDefineQuery(event.target.value);
  };

  const handleDefineQuery = () => {
    if (defineQuery !== '') {
      fetchDefinition(urlBase, token, defineQuery, setDefinitionVal);
    } else {
      setDefinitionVal('');
    }
  };

  const titleRef = React.useRef();
  const notesRef = React.useRef();

  // POPOVER

  ////////

  const { id } = useParams();
  const history = useHistory();
  const [loadingState, setLoadingState] = React.useState('load');
  const [parseLoad, setParseLoad] = React.useState('done');

  const [update, setUpdate] = React.useState(false);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedStoredUser = JSON.parse(storedUser);
      setUsername(parsedStoredUser.username);
      setToken(parsedStoredUser.token);
    }
  }, []);

  React.useEffect(() => {
    const [thisRead] = myReads.filter((myRead) => myRead.text_id === id);
    if (thisRead && id !== 'new') {
      setSingularRead(thisRead);
      const rawEditorState = convertFromRaw(
        JSON.parse(thisRead.text_body).editorState
      );
      const originalPdfDataUrl = JSON.parse(
        thisRead.text_body
      ).uploadedPdfDataUrl;
      dataUrlToFile(originalPdfDataUrl).then((res) => {
        setRawPdf(res);
      });

      setEditorState(EditorState.createWithContent(rawEditorState));
    }
    setLoadingState('done');
  }, []);

  React.useEffect(() => {
    if (id === 'new') {
      setEditorState(blankEditorState());
      setSingularRead('');
      setRawPdf(null);
      setRawDataUrl(null);
    }
  }, [id]);

  const saveArticle = async (editorState, rawPdf = null, rawDataUrl = null) => {
    const rawEditorState = convertToRaw(editorState.getCurrentContent());
    const textObject = createTextObject(
      `${titleRef.current.value || singularRead.text_title || 'New Read'}`,
      JSON.stringify({
        editorState: rawEditorState,
        notes: notesRef.current.value,
        uploadedPdfDataUrl: rawDataUrl,
      })
    );

    try {
      const payload = {
        method: `${id === 'new' ? 'POST' : 'PUT'}`,
        url: `${id === 'new' ? '/text/' : `/text/${id}`}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        data: textObject,
      };
      console.log(payload);
      const res = await axios(payload);
      console.log('RES', res);
      const resData = res.data;
      console.log('RESDATA', resData);

      if (resData.status === 'success') {
        toast.success(`${resData.message}`);
        if (payload.method === 'POST') {
          history.push(`/articles/${resData.text_id}`);
        }
        setUpdate(!update);
        const updatedReads = await getArticles(username);
        setMyReads(updatedReads);

        // Update title
        if (titleRef.current.value !== '') {
          setSingularRead({
            ...singularRead,
            text_title: titleRef.current.value,
          });
        }
        titleRef.current.value = '';
      } else {
        toast.warn(`${resData.message}`);
      }
    } catch (error) {
      toast.error('error saving article to server');
    }
  };

  const handleGetSumary = async () => {
    const selectedText = document.getSelection().toString();
    if (selectedText) {
      const summary = await getSummary(selectedText, token);
      console.log(summary);
      notesRef.current.value = summary;
    } else {
      toast.warn('No text selected for analysis.');
    }
    setUiBtn('analyse');
  };

  const handleTwitterQuery = () => {
    const formatedText = twitterQuery.replace(/ /g, '+');
    window.open(
      `http://twitter.com//intent/tweet?text=${formatedText}`,
      '_blank'
    );
  };

  const classes = useStyles();
  return (
    <Container className={classes.outerWidth}>
      <Navigation />
      <Container className={classes.container}>
        {loadingState !== 'done' && (
          <div>
            <CircularProgress color="primary" />
          </div>
        )}
        {loadingState === 'done' && (
          <Box className={classes.containerDiv}>
            <Box className={classes.titleDiv}>
              <Box className={classes.titleSubDiv}>
                <Box className={classes.titleText}>
                  <Typography align="left" variant="h4">
                    {id === 'new' ? 'New Read' : singularRead.text_title}
                  </Typography>
                </Box>
                <Box className={classes.titleDivBtns}>
                  <Box className={classes.titleDivMultipleBtn}>
                    <UploadDialog
                      setParseLoad={setParseLoad}
                      setRawPdf={setRawPdf}
                      setRawDataUrl={setRawDataUrl}
                    ></UploadDialog>
                  </Box>

                  {rawPdf && (
                    <Box className={classes.titleDivMultipleBtn}>
                      <PdfModal rawPdf={rawPdf} />
                    </Box>
                  )}

                  <Box className={classes.titleDivSingleBtn}>
                    <Tooltip>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.btnText}
                        onClick={() =>
                          saveArticle(editorState, rawPdf, rawDataUrl)
                        }
                      >
                        {id === 'new' ? 'Save New Read' : 'Update Read'}
                      </Button>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box className={classes.containerUi}>
              <Box className={classes.uiInteractionWrapper}>
                <TextField
                  placeholder={id === 'new' ? 'TItle' : 'Update Title'}
                  variant="outlined"
                  multiline
                  fullWidth
                  maxRows={2}
                  className={classes.uiInputText}
                  inputRef={titleRef}
                />

                <Box className={classes.uiInputText}>
                  {parseLoad === 'load' ? (
                    <Skeleton animation="wave" variant="rectangle">
                      <CustomEditor
                        notesRef={notesRef}
                        token={token}
                      ></CustomEditor>
                    </Skeleton>
                  ) : (
                    <CustomEditor
                      notesRef={notesRef}
                      token={token}
                    ></CustomEditor>
                  )}
                </Box>
              </Box>

              {/* end UI text/button interaction section */}

              <Box className={classes.uiDisplayWrapper}>
                <Box className={classes.uiDisplayBtnsWrapper}>
                  <Grid
                    container
                    spacing={0}
                    alignItems="center"
                    justify="center"
                    align="center"
                    className={classes.interactionBtnsGrid}
                  >
                    <Grid item xs={11} align="center">
                      <Box className={classes.btnUiWrapper}>
                        <Box className={classes.btnUiDiv}>
                          <Tooltip title="Read">
                            <Button
                              variant="outlined"
                              className={
                                uiBtn === 'define'
                                  ? classes.btnUiClicked
                                  : classes.btnUi
                              }
                              onClick={() => {
                                console.log('Clicked Read');
                                setUiBtn('define');
                              }}
                            >
                              Read
                            </Button>
                          </Tooltip>
                        </Box>
                        <Box className={classes.btnUiDiv}>
                          <Tooltip title="Analyse">
                            <Button
                              variant="outlined"
                              className={
                                uiBtn === 'analyse'
                                  ? classes.btnUiClicked
                                  : classes.btnUi
                              }
                              onMouseDown={async () => {
                                await handleGetSumary();
                              }}
                            >
                              Analyse
                            </Button>
                          </Tooltip>
                        </Box>
                        <Box className={classes.btnUiDiv}>
                          <Tooltip title="Web Info">
                            <Button
                              variant="outlined"
                              className={
                                uiBtn === 'weblinks'
                                  ? classes.btnUiClicked
                                  : classes.btnUi
                              }
                              onClick={() => {
                                console.log('Clicked Web Info');
                                setUiBtn('weblinks');
                              }}
                            >
                              Web Info
                            </Button>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <MyAccordian></MyAccordian>

                <TextField
                  placeholder="Define"
                  variant="outlined"
                  multiline
                  fullWidth
                  maxRows={1}
                  value={defineQuery}
                  onKeyPress={(eventkey) => {
                    if (eventkey.key === 'Enter') {
                      eventkey.preventDefault();
                      handleDefineQuery();
                    }
                  }}
                  onChange={(e) => {
                    handleChangeDefineQuery(e);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <Tooltip title="Clear Query">
                        <IconButton
                          className={classes.backspaceIconBtn}
                          onClick={() => {
                            setDefineQuery('');
                          }}
                        >
                          <BackspaceIcon />
                        </IconButton>
                      </Tooltip>
                    ),
                  }}
                  className={classes.uiInputText}
                />

                <TextField
                  placeholder="Definition"
                  variant="outlined"
                  multiline
                  inputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                  rows={5}
                  className={classes.displayTextfield}
                  value={definitionVal}
                />

                <TextField
                  placeholder="Text Analysis"
                  variant="outlined"
                  multiline
                  fullWidth
                  rows={15}
                  className={classes.uiInputText}
                  inputRef={notesRef}
                />
                <TextField
                  placeholder="Ask a question"
                  variant="outlined"
                  multiline
                  fullWidth
                  maxRows={1}
                  value={twitterQuery}
                  onKeyPress={(eventkey) => {
                    if (eventkey.key === 'Enter') {
                      eventkey.preventDefault();
                      // handleDefineQuery();
                    }
                  }}
                  onChange={(e) => {
                    setTwitterQuery(e.target.value);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HelpOutlineIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <Tooltip title="Ask on Twitter">
                        <IconButton
                          className={classes.twitterIconBtn}
                          onClick={() => {
                            handleTwitterQuery();
                          }}
                        >
                          <TwitterIcon />
                        </IconButton>
                      </Tooltip>
                    ),
                  }}
                  className={classes.uiInputText}
                />
              </Box>
              {/* end UI display section */}
            </Box>
            <br />
            <br />
          </Box>
        )}
      </Container>
    </Container>
  );
};

export default Article;
