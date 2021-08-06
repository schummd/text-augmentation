import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Youtube from './Youtube';
import { Box, List, ListItem } from '@material-ui/core';
import * as youtubeSearch from 'youtube-search';
import { toast } from 'react-toastify';

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

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  React.useEffect(() => {
    const getYoutubeVideos = async (keyword) => {
      const opts = {
        maxResults: 3,
        key: process.env.REACT_APP_YT_KEY,
      };

      try {
        const { results } = await youtubeSearch(keyword, opts);
        console.log('RES: ', results);
        const res = results.map((result) => result.id);
        setVideoIds(res);
      } catch (error) {
        toast.error('error retrieving youtube videos.');
      }
    };
    getYoutubeVideos(searchTerm);
  }, [searchTerm]);

  return (
    <div className={classes.root}>
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
              <List>
                {videoIds.map((id) => (
                  <ListItem key={id}>
                    <Youtube embedId={id} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel2'}
        onChange={handleChange('panel2')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography className={classes.secondaryHeading}>
            External links
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Donec placerat, lectus sed mattis semper, neque lectus feugiat
            lectus, varius pulvinar diam eros in elit. Pellentesque convallis
            laoreet laoreet.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
