import React, { useContext, useState } from 'react';
import styles from '../createQueue/CreateQueuePage.module.css';
import { Button, TextField } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ApiContext } from '../util/api';

export default function UserJoinPage (props) {
  const [ name, setName ] = useState('');
  const [ msg, setMsg ] = useState('');
  const qid = useParams().qid;
  const api = useContext(ApiContext);
  const onClick = () => {
    // Check data is valid
    if (name.length === 0) {
      alert('Name cannot be empty');
      return;
    } else if (msg.length === 0) {
      alert('Message cannot be empty');
      return;
    }
    props.setLoading(true);
    const join = async (name, msg) => {
      const response = await api.queueJoin(qid, name, msg);
      if (response.status === 400) {
        alert('Invalid qid')
        return;
      }
      // Load data
      const data = await response.json();
      // Save Data
      window.localStorage.setItem('token', data.token);
      console.log(data);
      window.localStorage.setItem('uid', data.uid);
      props.setToken(data.token);
      props.setUid(data.uid);
      return;
    }
    join(name, msg);
  }
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageContent}>
        <div className={styles.pageTitle}>{props.queueName}</div>
        <div className={styles.actionWrapper}>
          <TextField value={name}
            onChange={e => setName(e.target.value)} label='Name'/>
        </div>
        <div className={styles.actionWrapper}>
          <TextField 
            value={msg} multiline rows={8}
            onChange={e => setMsg(e.target.value)}label='Your Message'/>
        </div>
        <div className={styles.actionWrapper}>
          <Button onClick={onClick} variant="contained" color="secondary">
            Join
          </Button>
        </div>
      </div>
    </div>
  )
}

UserJoinPage.propTypes = {
  queueName: PropTypes.string,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  setToken: PropTypes.func,
  setUid: PropTypes.func
}