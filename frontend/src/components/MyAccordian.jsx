import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Youtube from './Youtube';
import { Box, Link, List, ListItem } from '@material-ui/core';
import * as youtubeSearch from 'youtube-search';
import { toast } from 'react-toastify';
import axios from 'axios';
import { StoreContext } from '../utils/store';
import { dataUrlToFile } from '../utils/utils';
import PdfModal from '../components/PdfModal';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  videosDiv: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    margin: 'auto',
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function ControlledAccordions({ searchTerm }) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [videoIds, setVideoIds] = React.useState(false);
  const [wikipediaSummary, setWikipediaSummary] = React.useState(false);
  const [newsApiArticles, setNewsApiArticles] = React.useState(false);
  const [academicPapers, setAcademicPapers] = React.useState(false);
  const [rawPdf, setRawpdf] = React.useState(false);
  const [openPdfModal, setOpenPdfModal] = React.useState(false);
  const [pdfLoading, setPdfLoading] = React.useState(false);

  const context = React.useContext(StoreContext);
  const [token] = context.token;

  const resultNotFoundMessage = `Oops. Nothing found...please try some other terms 😢`;

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  React.useEffect(() => {
    const getYoutubeVideos = async (keyword) => {
      if (!process.env.REACT_APP_YT_KEY) {
        toast.error('Youtube API key not found.');
        return;
      }
      const opts = {
        maxResults: 4,
        key: process.env.REACT_APP_YT_KEY,
      };

      try {
        const { results } = await youtubeSearch(`${keyword} scientific`, opts);
        const res = results.map((result) => result.id);
        setVideoIds(res);
      } catch (error) {
        toast.error('error retrieving youtube videos.');
      }
    };

    const getNewsApiArticles = async (keyword) => {
      if (!process.env.REACT_APP_NEWSAPI_KEY) {
        toast.error('newsapi key not found');
        return;
      }
      const url =
        'https://newsapi.org/v2/everything?' +
        `q=${keyword}&` +
        'sortBy=popularity&' +
        `apiKey=${process.env.REACT_APP_NEWSAPI_KEY}`;

      const instance = axios.create({
        timeout: 5000,
      });

      instance.interceptors.response.use(
        function (res) {
          return res;
        },
        (err) => {
          console.log(err);
          toast.error(err);
        }
      );

      const res = await instance.get(url);
      if (res) {
        const data = res.data;
        console.log(data);
        const articles = res.data.articles;
        setNewsApiArticles(articles);
      } else {
        toast.error('Error fetchiing news articles.');
      }
    };

    const getAcadamicPapers = async (keyword) => {
      if (!process.env.REACT_APP_UNPAYWALL_EMAIL) {
        toast.error('Email environemnt variable for Unpaywalled not found.');
        return;
      }
      const url = `https://api.unpaywall.org/v2/search/?query=${keyword}&is_oa=true&email=${process.env.REACT_APP_UNPAYWALL_EMAIL}`;
      const instance = axios.create({
        timeout: 5000,
      });

      instance.interceptors.response.use(
        function (res) {
          return res;
        },
        (err) => {
          console.log(err);
        }
      );

      const res = await instance.get(url);
      const papers = res.data.results;
      const papersWithFullPdfs = papers.filter(
        (paper) => paper.response.best_oa_location.url_for_pdf
      );
      console.log(papersWithFullPdfs);

      // Get first 10 results
      const slicedPapers =
        papersWithFullPdfs.length > 10
          ? papersWithFullPdfs.slice(0, 10)
          : papersWithFullPdfs;

      setAcademicPapers(slicedPapers);
    };

    const getWikipediaEntry = async (keyword) => {
      const payload = {
        method: `GET`,
        url: `/wikipedia/${keyword}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      };
      console.log(payload);
      try {
        const res = await axios(payload);
        const summary = res.data.Summary;
        setWikipediaSummary(summary);
      } catch (error) {
        setWikipediaSummary(resultNotFoundMessage);
      }
    };

    if (searchTerm) {
      const formattedSearchTerm = searchTerm.replace(/[^A-Za-z0-9]+/g, '%20');
      getYoutubeVideos(formattedSearchTerm);
      getNewsApiArticles(formattedSearchTerm);
      getAcadamicPapers(formattedSearchTerm);
      getWikipediaEntry(formattedSearchTerm);
    }
  }, [searchTerm]);

  const handleDisplayPdf = async (url) => {
    setPdfLoading(true);
    setOpenPdfModal(true);
    const payload = {
      method: `POST`,
      url: `/parse/urltopdf`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
      data: { url },
    };
    console.log(payload);
    try {
      const res = await axios(payload);
      const data = res.data;
      const file = await dataUrlToFile(data.data);
      setRawpdf(file);
      setPdfLoading(false);
    } catch (error) {
      toast.error('error reading pdf link');
    }
  };

  return (
    <div className={classes.root}>
      <PdfModal
        rawPdf={rawPdf}
        open={openPdfModal}
        setOpen={setOpenPdfModal}
        loading={pdfLoading}
      />
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.secondaryHeading}>
            Youtube Videos
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box className={classes.videosDiv}>
            {videoIds && (
              <Box>
                {videoIds.map((id) => (
                  <Youtube embedId={id} />
                ))}
              </Box>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel3'}
        onChange={handleChange('panel3')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography className={classes.secondaryHeading}>
            Wikipedia Summary
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {wikipediaSummary && wikipediaSummary}
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel4'}
        onChange={handleChange('panel4')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography className={classes.secondaryHeading}>
            In the news
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {newsApiArticles && (
            <Box>
              {newsApiArticles.length > 0 ? (
                <List>
                  {newsApiArticles.map((article) => (
                    <ListItem>
                      <Link
                        href={article.url}
                        rel="noopener noreferrer"
                        variant="body1"
                        target="_blank"
                      >
                        {article.title}
                      </Link>
                    </ListItem>
                  ))}
                </List>
              ) : (
                resultNotFoundMessage
              )}
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel5'}
        onChange={handleChange('panel5')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel5bh-content"
          id="panel5bh-header"
        >
          <Typography className={classes.secondaryHeading}>
            Scientific Papers
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {academicPapers && (
            <Box>
              {academicPapers.length > 0 ? (
                <List>
                  {academicPapers.map((paper) => (
                    <ListItem>
                      <Link
                        href={paper.response.best_oa_location.url_for_pdf}
                        rel="noopener noreferrer"
                        variant="body1"
                        target="_blank"
                      >
                        {paper.response.title}
                      </Link>

                      <Link
                        variant="body1"
                        onClick={() => {
                          setPdfLoading(true);
                          handleDisplayPdf(
                            paper.response.best_oa_location.url_for_pdf
                          );
                        }}
                        component="button"
                      >
                        {'VIEW PDF'}
                      </Link>
                    </ListItem>
                  ))}
                </List>
              ) : (
                resultNotFoundMessage
              )}
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
