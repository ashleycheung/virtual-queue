import React, { useContext, useState } from 'react';
import styles from './CreateQueuePage.module.css';
import { ApiContext } from '../util/api';
import { useHistory } from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';

export default function CreateQueuePage () {
  const [ qName, setQName ] = useState('');
  const [ name, setName ] = useState('');
  const history = useHistory();
  const api = useContext(ApiContext);
  const onClick = () => {
    if (qName.length === 0 || name.length === 0) {
      alert('Both Queue Name and Name must be given');
      return;
    }
    api.queueAdminCreate(name, qName)
      .then(r => r.json())
      .then(r => {
        window.localStorage.setItem('token', r.token);
        window.localStorage.setItem('uid', r.uid);
        history.push(`/admin/dashboard/${r.qid}`);
      })
  }
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageContent}>
        <div className='page-title'>Create Room</div>
        <div className={styles.actionWrapper}>
          <TextField value={qName}
            onChange={e => setQName(e.target.value)} label='Queue Name'/>
        </div>
        <div className={styles.actionWrapper}>
          <TextField value={name}
            onChange={e => setName(e.target.value)}label='Your Name'/>
        </div>
        <div className={styles.actionWrapper}>
          <Button onClick={onClick} variant="contained" className='redBtn'>
            Create Queue
          </Button>
        </div>
      </div>
    </div>
  )
}