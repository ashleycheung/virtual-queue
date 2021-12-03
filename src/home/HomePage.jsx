import React from 'react';
import styles from './HomePage.module.css';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';

export default function HomePage () {
  const history = useHistory();
  const onClick = () => {
    history.push('/admin/create');
  }
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageContent}>
        <div className='page-title'>
          Virtual Queue
        </div>
        <Button onClick={onClick} variant="contained" className='redBtn'>
          Create Queue
        </Button>
      </div>
    </div>
  )
}