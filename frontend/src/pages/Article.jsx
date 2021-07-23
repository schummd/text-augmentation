import React from 'react';
import { StoreContext } from '../utils/store';
import {
  convertToRaw,
  convertFromRaw,
  EditorState,
  convertFromHTML,
  ContentState,
} from 'draft-js';
import { createTextObject } from '../utils/utils';
import Navigation from '../components/Navigation';
import { Redirect, useParams, useHistory } from 'react-router-dom';
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
  FormControl,
} from '@material-ui/core';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import SearchIcon from '@material-ui/icons/Search';
import CustomEditor from '../components/CustomEditor';
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
  btnUiWrapper: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
  },
  btnUiDiv: {
    display: 'flex',
    paddingRight: '8px',
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
}));

const Article = () => {
  const context = React.useContext(StoreContext);
  const [token, setToken] = context.token;
  const [username, setUsername] = context.username;
  const [editorState, setEditorState] = context.editorState;
  const [singularRead, setSingularRead] = context.singularRead;
  const [myReads, setMyReads] = context.myReads;
  const { blankEditorState } = context;

  const [uiBtn, setUiBtn] = React.useState('define');
  const [highlightMode, setHighlightMode] = React.useState(false);
  const titleRef = React.useRef();
  const notesRef = React.useRef();

  const { id } = useParams();
  const history = useHistory();
  const [loadingState, setLoadingState] = React.useState('load');
  const [update, setUpdate] = React.useState(false);

  const parsedPdfToHtml = (data) => {
    const { sections } = data;
    const sectionsOfInterest = sections.filter((section) =>
      section.hasOwnProperty('heading')
    );
    return sectionsOfInterest
      .map((section) => `<h3>${section.heading}</h3><p>${section.text}</p>`)
      .join('');
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
      const markup = parsedPdfToHtml(resData.data);
      const blocksFromHTML = convertFromHTML(markup);
      const state = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      const newState = EditorState.createWithContent(state);
      // console.log(newState);
      setEditorState(newState);
    } catch (error) {
      console.log(error);
      toast.error('error parsing PDF');
    }

    // console.log(file);
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
        titleRef.current.value = '';
      } else {
        toast.warn(`${resData.message}`);
      }
    } catch (error) {
      toast.error('error saving article to server');
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
        toast.success(`Retrieved Reads from server.`);
      } else {
        toast.warn(`${resData.message}`);
      }
      const { data } = resData;
      return data;
    } catch (error) {
      toast.error('Error retrieving Reads from server.');
    }
  };

  React.useEffect(() => {
    if (token === null) {
      return <Redirect to={{ pathname: '/login' }} />;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
                  <Box className={classes.titleDivSingleBtn}>
                    <Tooltip title="Upload">
                      <form onSubmit={handleSubmit(uploadSubmit)}>
                        <input
                          accept="application/pdf"
                          // className={classes.input}
                          style={{ display: 'none' }}
                          id="raised-button-file"
                          multiple
                          type="file"
                          name="pdfFile"
                          {...register('uploadedPDF', { required: true })}
                        />
                        <label htmlFor="raised-button-file">
                          <Button
                            variant="contained"
                            component="span"
                            className={classes.btnText}
                            color="secondary"
                          >
                            Upload
                          </Button>
                        </label>
                        <FormControl>
                          <Button
                            className={classes.btnText}
                            variant="contained"
                            color="primary"
                            type="submit"
                          >
                            Parse Upload
                          </Button>
                        </FormControl>
                      </form>
                    </Tooltip>
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

                <CustomEditor></CustomEditor>

                <Grid
                  container
                  spacing={0}
                  alignItems="center"
                  justify="center"
                  align="center"
                  className={classes.interactionBtnsGrid}
                >
                  <Grid
                    container
                    item
                    xs={1}
                    align="center"
                    justify="flex-start"
                  >
                    <Box className={classes.btnHighlightDiv}>
                      <Tooltip title="Highlight">
                        <IconButton
                          className={
                            highlightMode === true
                              ? classes.btnHighlightClicked
                              : classes.btnHighlight
                          }
                          variant="contained"
                          disableFocusRipple
                          disableRipple
                          onClick={() => {
                            console.log('Clicked Highlight');
                            setHighlightMode(!highlightMode);
                          }}
                        >
                          <BorderColorIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>

                  <Grid item xs={11} align="center">
                    <Box className={classes.btnUiWrapper}>
                      <Box className={classes.btnUiDiv}>
                        <Tooltip title="Define">
                          <Button
                            variant="outlined"
                            className={
                              uiBtn === 'define'
                                ? classes.btnUiClicked
                                : classes.btnUi
                            }
                            onClick={() => {
                              console.log('Clicked Define');
                              setUiBtn('define');
                            }}
                          >
                            Define
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
                            onClick={() => {
                              console.log('Clicked Analyse');
                              setUiBtn('analyse');
                            }}
                          >
                            Analyse
                          </Button>
                        </Tooltip>
                      </Box>
                      <Box className={classes.btnUiDiv}>
                        <Tooltip title="Web Links">
                          <Button
                            variant="outlined"
                            className={
                              uiBtn === 'weblinks'
                                ? classes.btnUiClicked
                                : classes.btnUi
                            }
                            onClick={() => {
                              console.log('Clicked Web Links');
                              setUiBtn('weblinks');
                            }}
                          >
                            Web Links
                          </Button>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              {/* end UI text/button interaction section */}
              <Box className={classes.uiDisplayWrapper}>
                <TextField
                  placeholder="Define"
                  variant="outlined"
                  multiline
                  fullWidth
                  maxRows={1}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
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
                />

                <TextField
                  placeholder="Notes"
                  variant="outlined"
                  multiline
                  fullWidth
                  rows={15}
                  className={classes.uiInputText}
                  inputRef={notesRef}
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
