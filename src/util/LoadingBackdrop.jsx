import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function LoadingBackdrop (props) {
  const classes = useStyles();
  return (
    <Backdrop className={classes.backdrop}
      open={props.open} onClick={() => {}}>
      <CircularProgress/>
    </Backdrop>
  )
}

LoadingBackdrop.propTypes = {
  open: PropTypes.bool
}