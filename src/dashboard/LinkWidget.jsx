import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import styles from './LinkWidget.module.css';

export default function LinkWidget (props) {
  const onCopy = () => {
    window.navigator.clipboard.writeText(props.link);
    alert('Copied!');
  }
  return (
    <div className={styles.widgetWrapper}>
      <div className={styles.widgetLink}>{props.link}</div>
      <Button variant="contained" color="primary"
        onClick={onCopy}>Copy</Button>
    </div>)
}

LinkWidget.propTypes = {
  link: PropTypes.string
}