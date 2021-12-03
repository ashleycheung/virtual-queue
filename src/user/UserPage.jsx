import React, { useContext, useEffect, useState, useRef } from 'react';
import { ApiContext } from '../util/api';
import { useHistory, useParams } from 'react-router-dom';
import UserJoinPage from './UserJoinPage';
import styles from './UserPage.module.css';
import LoadingBackdrop from '../util/LoadingBackdrop';
import Ticket from './Ticket';

export default function UserPage() {
  const [token, setToken] = useState(window.localStorage.getItem('token'));
  let initialUid = window.localStorage.getItem('uid');
  if (initialUid != null) {
    initialUid = parseInt(initialUid);
  }
  const history = useHistory();
  const [uid, setUid] = useState(initialUid);
  const qid = useParams().qid;
  const api = useContext(ApiContext);
  const [loading, setLoading] = useState(false);
  const [ queueData, setQueueData ] = useState();
  const [ hasUpdateAfterJoin, setHasUpdateAfterJoin ] = useState(false);
  const socketApi = useRef(api.createSocket());
  /**
   * Loads the Page, gets status of queue
   */
  const loadPage = useRef(async () => {
    // Get the status of the queue
    const response =  await api.queueStatus(qid);
    if (response.status === 400) {
      alert('Invalid qid')
      return;
    }
    // Load data
    const data = await response.json();
    setQueueData(data);
  })
  useEffect(() => { loadPage.current() }, [loadPage]);
  // Attaches socket handlers
  const attachSocketHandlers = (socket) => {
    socket.on('queue:update', data => {
      setQueueData(data);
      setHasUpdateAfterJoin(true);
      console.log('Connected');
    })
    socket.on('queue:complete', (uid) => {
      console.log("received complete")
      history.push('/');
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('uid');
    })
    socket.on('queue:remove', (uid) => {
      console.log("received complete")
      history.push('/');
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('uid');
    })
  }
  // When token is first set, start socket
  useEffect(() => {
    console.log(`Token is ${token}`)
    if (token === null) {
      return;
    }
    socketApi.current.connect(qid, token)
      .then(socket => attachSocketHandlers(socket))
  }, [token, qid])
  
  if (queueData === undefined) {
    return (
      <LoadingBackdrop open={true}/>
    )
  } else if (token === null || uid === null || uid === undefined) {
    return (
      <React.Fragment>
        <LoadingBackdrop open={loading}/>
        <UserJoinPage queueName={queueData.queue.name}
          loading={loading} setLoading={setLoading} setToken={setToken}
          setUid={setUid}/>
      </React.Fragment>
    )
  } else if (!(uid in queueData.users)) {
    console.log(uid === undefined);
    console.log(uid);
    console.log(queueData);
    if (hasUpdateAfterJoin) {
      alert('Invalid Uid');
      window.localStorage.removeItem('uid');
      window.localStorage.removeItem('token');
      setToken(null);
      return (null);
    } else {
      loadPage.current();
      return (
        <LoadingBackdrop open={true}/>
      )
    }
  }
  const loadTicket = () => {
    console.log(queueData);
    const message = queueData.users[uid].message;
    if (queueData.queue.queue.includes(uid)) {
      const insertPlaceSuffix = (position) => {
        const posStr = position.toString();
        const lastChar = posStr.charAt(posStr.length - 1);
        switch (lastChar) {
          case '1':
            return posStr + 'st';
          case '2':
            return posStr + 'nd';
          case '3':
            return posStr + 'rd';
          default:
            return posStr + 'th';
        }
      }
      return (<Ticket 
        bannerMessage={insertPlaceSuffix(queueData.queue.queue.indexOf(uid) + 1)}
        message={message}
        />)
    } else if (queueData.queue.serving.includes(uid)) {
      return (<Ticket 
        bannerMessage='Currently Serving'
        message={message}
        />)
    }
  }
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageTitle}>{queueData.queue.name}</div>
      <div className={styles.pageDialogText}>
        {`Hi ${queueData.users[uid].name}, your position is:`}
      </div>
      <div className={styles.pageContent}>
        {loadTicket()}
      </div>
    </div>
  )
}