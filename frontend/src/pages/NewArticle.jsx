import React from 'react';
import { StoreContext } from '../utils/store';
import Navigation from '../components/Navigation';
import {
  Redirect,
} from 'react-router-dom';
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
import BorderColorIcon from '@material-ui/icons/BorderColor';
import SearchIcon from '@material-ui/icons/Search';
// import axios from 'axios';
// import { toast } from 'react-toastify';

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
    }
  },
  displayTextfield: {
    width: '100%',
    height: '100%',
    margin: theme.spacing(1),
    color: 'black',
  },
}));

const NewArticle = () => {
  const context = React.useContext(StoreContext);
  // const urlBase = context.urlBase;
  const token = context.token[0];
  
  const [uiBtn, setUiBtn] = React.useState('define');
  const [highlightMode, setHighlightMode] = React.useState(false);

  React.useEffect(() => {
    if (token === null) {
      return <Redirect to={{ pathname: '/login' }} />
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const setPage = context.pageState[1];
  const [loadingState, setLoadingState] = React.useState('load');

  React.useEffect(() => {
    setPage('/articles/new');
    async function setupHome () {
      setLoadingState('loading');
      setLoadingState('done');
    }
    setupHome();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const classes = useStyles();
  return (
    <Container className={classes.outerWidth}>
      <Navigation />
      <Container className={classes.container}>
        {
          loadingState !== 'done' &&
          <div>
            <CircularProgress color="primary" />
          </div>
        }
        {
          loadingState === 'done' &&
          <Box className={classes.containerDiv}>
            <Box className={classes.titleDiv}>
              <Box className={classes.titleSubDiv}>
                <Box className={classes.titleText}>
                  <Typography align="left" variant="h4">
                    New Article
                  </Typography>
                </Box>
                <Box className={classes.titleDivBtns}>
                  <Box className={classes.titleDivSingleBtn}>
                    <Tooltip title="Upload">
                      <Button
                        variant="contained"
                        className={classes.btnText}
                        onClick={() => {
                          console.log("Clicked Upload")
                        }}
                      >
                        Upload
                      </Button>
                    </Tooltip>
                  </Box>
                  <Box className={classes.titleDivSingleBtn}>
                    <Tooltip title="Save Article">
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.btnText}
                        onClick={() => {
                          console.log("Clicked Save Article")
                        }}                        
                      >
                        Save Article
                      </Button>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box className={classes.containerUi}>
              <Box className={classes.uiInteractionWrapper}>
                <TextField
                  placeholder="Title"
                  variant="outlined"
                  multiline
                  fullWidth
                  maxRows={2}
                  className={classes.uiInputText}
                />
                <TextField
                  placeholder="Text"
                  variant="outlined"
                  multiline
                  fullWidth
                  rows={20}
                  className={classes.uiInputText}
                />

                <Grid
                  container
                  spacing={0}
                  alignItems="center"
                  justify="center"
                  align="center"
                  className={classes.interactionBtnsGrid}
                >

                  <Grid container item xs={1} align="center" justify="flex-start">
                    <Box className={classes.btnHighlightDiv}>
                      <Tooltip title="Highlight">
                        <IconButton
                          className={
                            highlightMode === true ?
                              classes.btnHighlightClicked :
                              classes.btnHighlight
                          }
                          variant="contained"
                          disableFocusRipple
                          disableRipple
                          onClick={() => {
                            console.log("Clicked Highlight")
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
                              uiBtn === 'define' ?
                                classes.btnUiClicked :
                                classes.btnUi
                            }
                            onClick={() => {
                              console.log("Clicked Define")
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
                              uiBtn === 'analyse' ?
                                classes.btnUiClicked :
                                classes.btnUi
                            }
                            onClick={() => {
                              console.log("Clicked Analyse")
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
                              uiBtn === 'weblinks' ?
                                classes.btnUiClicked :
                                classes.btnUi
                            }
                            onClick={() => {
                              console.log("Clicked Web Links")
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
                    readOnly: true
                  }}
                  fullWidth
                  rows={5}
                  // value={definedText}
                  className={classes.displayTextfield}
                />

                <TextField
                  placeholder="Notes"
                  variant="outlined"
                  multiline
                  fullWidth
                  rows={15}
                  className={classes.uiInputText}
                />

              </Box>
              {/* end UI display section */}
            </Box>
            <br />
            <br />
          </Box>
        }
      </Container>
    </Container>
  );
}

export default NewArticle;
