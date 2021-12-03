import React, { useContext, useRef, useState } from 'react';
import styles from './UserCard.module.css';
import PropTypes from 'prop-types';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { Menu, MenuItem } from '@material-ui/core';
import { ApiContext } from '../util/api';
import { useParams } from 'react-router-dom';

export default function UserCard (props) {
  const api = useContext(ApiContext);
  const qid = useParams().qid;
  const token = window.localStorage.getItem('token');
  const [ menuOpen, setMenuOpen ] = useState(false);
  const menuBtn = useRef(null);
  const renderMenuItems = () => {
    if (props.type === 'serving') {
      const onComplete = () => {
        api.queueAdminCompleteUser(props.uid, token, qid)
      }
      return (
        <MenuItem onClick={onComplete}>Complete</MenuItem>
      )
    }
    const onRemove = () => {
      api.queueAdminRemoveUser(props.uid, token, qid)
    }
    return (
      <MenuItem onClick={onRemove}>Remove</MenuItem>
    )
  }
  return (
    <div className={styles.userCard}>
      <Menu 
        anchorEl={() => menuBtn.current}
        open={menuOpen} onClose={() => setMenuOpen(false)}>
        { renderMenuItems() }
      </Menu>
      <div className={styles.cardUsername}>{props.name}</div>
      <div className={styles.cardMessage}>{props.message}</div>
      <div className={styles.cardTime}>
        <div>{props.time}</div>
        <AccessTimeIcon/>
      </div>
      <div className={styles.cardAction}>
        <div ref={menuBtn} onClick={() => setMenuOpen(true)}
          className={styles.optionsButton}>
          <MoreVertIcon fontSize='inherit'/>
        </div>
      </div>
    </div>
  )
}

UserCard.propTypes = {
  uid: PropTypes.number,
  name: PropTypes.string,
  time: PropTypes.number,
  message: PropTypes.string
}