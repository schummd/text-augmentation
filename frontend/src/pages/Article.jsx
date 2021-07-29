import React from 'react';
import { StoreContext } from '../utils/store';
import {
  convertToRaw,
  convertFromRaw,
  EditorState,
  convertFromHTML,
  ContentState,
} from 'draft-js';
import { createTextObject, fetchDefinition } from '../utils/utils';
import Navigation from '../components/Navigation';
import { Redirect, useParams, useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
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
    // flexDirection: 'row',
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

  const [uiBtn, setUiBtn] = React.useState('analyse');

  const [defineQuery, setDefineQuery] = React.useState('');
  const [twitterQuery, setTwitterQuery] = React.useState('');
  const [definitionVal, setDefinitionVal] = React.useState('');
  const handleChangeDefineQuery = async (event) => {
    await setDefineQuery(event.target.value);
  };
  const handleChangeTwitterQuery = async (event) => {
    await setTwitterQuery(event.target.value);
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

  const { id } = useParams();
  const history = useHistory();
  const [loadingState, setLoadingState] = React.useState('load');
  const [parseLoad, setParseLoad] = React.useState('done');

  const [update, setUpdate] = React.useState(false);

  const [formState, setFormState] = React.useState({
    title: true,
    abstract: true,
    authors: true,
    body: true,
    references: true,
  });

  const parsedPdfToHtml = (data, formState) => {
    const { abstractText, authors, references, sections, title, year } = data;

    const parsedTitleAndYear = formState.title
      ? `<h2>${title} (${year})</h2>`
      : '';

    const parsedAbstract = formState.abstract
      ? `<h3>Abstract</h3><p>${abstractText}</p>`
      : '';

    const parsedAuthors = formState.authors
      ? `<h3>Authors</h3><p>${authors
          .map((author) => author.name)
          .join(', ')}</p>`
      : '';

    const sectionsOfInterest = sections.filter((section) =>
      section.hasOwnProperty('heading')
    );

    const parsedSections = formState.body
      ? sectionsOfInterest
          .map((section) => `<h3>${section.heading}</h3><p>${section.text}</p>`)
          .join('')
      : '';

    const parsedReferences = formState.references
      ? `<h3>References</h3>
    ${references
      .map(
        (reference) =>
          `<p>
          ${reference.authors.join(', ')}, ${reference.year}, ${
            reference.title
          }, ${reference.venue}
          </p>`
      )
      .join('')}`
      : '';

    return `${parsedTitleAndYear}
            ${parsedAuthors}
            ${parsedAbstract}
            ${parsedSections}
            ${parsedReferences}`;
  };

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
      setEditorState(EditorState.createWithContent(rawEditorState));
    }
    setLoadingState('done');
  }, []);

  React.useEffect(() => {
    if (id === 'new') {
      setEditorState(blankEditorState());
      setSingularRead('');
    }
  }, [id]);

  const { register, handleSubmit } = useForm();

  const readFile = async (file) => {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => {
        resolve(fr.result);
      };
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });
  };

  const uploadSubmit = async (d) => {
    setParseLoad('load');
    const uploadedFile = d.uploadedPDF[0];
    const dataUrl = await readFile(uploadedFile);
    const rawBase64Data = dataUrl.split(',')[1];

    try {
      const payload = {
        method: `POST`,
        url: `/parse/`,
        headers: {
          'Content-Type': 'application/json',
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        data: rawBase64Data,
      };

      const res = await axios(payload);
      const resData = res.data;
      console.log(resData);
      if (resData.status === 'success') {
        toast.success(`${resData.message}`);
      } else {
        toast.warn(`${resData.message}`);
      }
      const markup = parsedPdfToHtml(resData.data, formState);
      const blocksFromHTML = convertFromHTML(markup);
      const state = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      const newState = EditorState.createWithContent(state);
      setEditorState(newState);
    } catch (error) {
      console.log(error);
      toast.error('error parsing PDF');
    }
    setParseLoad('done');
  };

  const saveArticle = async (editorState) => {
    const rawEditorState = convertToRaw(editorState.getCurrentContent());
    const textObject = createTextObject(
      `${titleRef.current.value || singularRead.text_title || 'New Read'}`,
      JSON.stringify({
        editorState: rawEditorState,
        notes: notesRef.current.value,
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
      const resData = res.data;
      console.log(resData);
      if (resData.status === 'success') {
        toast.success(`${resData.message}`);
        if (payload.method === 'POST') {
          history.push(`/articles/${resData.text_id}`);
        }
        setUpdate(!update);
        const updatedReads = await getArticles();
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

  const getSummary = async (textToAnalyse) => {
    try {
      const payload = {
        method: 'POST',
        url: `/summary/`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        data: { text_body: textToAnalyse },
      };
      console.log(payload);
      const res = await axios(payload);
      const resData = res.data;
      const { summary } = resData;
      return summary;
    } catch (error) {
      toast.error('Error summarising selected text.');
    }
  };

  const getArticles = async () => {
    try {
      const payload = {
        method: 'GET',
        url: `/text/${username}`,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      console.log(payload);
      const res = await axios(payload);
      const resData = res.data;
      console.log(resData);
      if (resData.status === 'success') {
        // toast.success(`Retrieved Reads from server.`);
        console.log('success');
      } else {
        toast.warn(`${resData.message}`);
      }
      const { data } = resData;
      return data;
    } catch (error) {
      toast.error('Error retrieving Reads from server.');
    }
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
                      handleSubmit={handleSubmit}
                      uploadSubmit={uploadSubmit}
                      register={register}
                      formState={formState}
                      setFormState={setFormState}
                    ></UploadDialog>
                  </Box>
                  <Box className={classes.titleDivSingleBtn}>
                    <Tooltip title="Save Read">
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.btnText}
                        onClick={() => saveArticle(editorState)}
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
                      <CustomEditor />
                    </Skeleton>
                  ) : (
                    <CustomEditor></CustomEditor>
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
                                const selectedText = document
                                  .getSelection()
                                  .toString();
                                if (selectedText) {
                                  const summary = await getSummary(
                                    selectedText
                                  );
                                  console.log(summary);
                                  notesRef.current.value = summary;
                                } else {
                                  toast.warn('No text selected for analysis.');
                                }
                                setUiBtn('analyse');
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
                    handleChangeTwitterQuery(e);
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
                            const formatedText = twitterQuery.replace(
                              / /g,
                              '+'
                            );
                            window.open(
                              `http://twitter.com//intent/tweet?text=${formatedText}`,
                              '_blank'
                            );
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
