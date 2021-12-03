import { Button } from '@material-ui/core';
import React from 'react';
import styles from './Ticket.module.css';
import EditIcon from '@material-ui/icons/Edit';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import PropTypes from 'prop-types';

export default function Ticket(props) {
  return(
    <div className={styles.ticketWrapper}>
      <div className={styles.ticketTop}>
        <div className={`${styles.circle} ${styles.centerLeft}`}></div>
        <div className={`${styles.circle} ${styles.centerRight}`}></div>
        <div className={styles.ticketPosition}>
          {props.bannerMessage}
        </div>
      </div>
      <div className={styles.ticketContent}>
        <div className={`${styles.circle} ${styles.bottomLeft}`}></div>
        <div className={`${styles.circle} ${styles.bottomRight}`}></div>
        <div className={styles.ticketMainContent}>
          <div className={styles.ticketMainContentTitle}>Message</div>
          {props.message}
        </div>
        <hr className={styles.dashed}/>
      </div>
      <div className={styles.ticketAction}>
        <Button variant="contained" className='yellowBtn'>
          <div className={styles.iconWrapper}>
            <EditIcon fontSize='inherit'/>
          </div>
        </Button>
        <Button variant="contained" className='redBtn'>
          <div className={styles.iconWrapper}>
            <RemoveCircleIcon fontSize='inherit'/>
          </div>
        </Button>
      </div>
    </div>
  )
}

Ticket.propTypes = {
  message: PropTypes.string,
  bannerMessage: PropTypes.string
}