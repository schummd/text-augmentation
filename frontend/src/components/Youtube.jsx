import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  video: {
    overflow: 'hidden',
    padding: '60%',
    position: 'relative',
    height: 0,
  },
  videoIframe: {
    left: 0,
    top: 0,
    height: '75%',
    width: '80%',
    position: 'absolute',
  },
}));

const Youtube = ({ embedId }) => {
  const classes = useStyles();
  return (
    <div className={classes.video}>
      <iframe
        className={classes.videoIframe}
        width="400"
        height="200"
        src={`https://www.youtube.com/embed/${embedId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
      />
    </div>
  );
};

export default Youtube;
