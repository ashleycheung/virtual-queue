import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ApiContext } from '../util/api';
import styles from './Dashboard.module.css';
import UserCard from './UserCard';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import LinkWidget from './LinkWidget';
import LoadingBackdrop from '../util/LoadingBackdrop';

function DroppableUserList(props) {
  return (
    <Droppable droppableId={props.dropId}>
      {(provided) => (
        <div className={styles.userCardList}
          {...provided.droppableProps} ref={provided.innerRef}>
          {props.users.map((uid, index) => {
          const userData = props.queueData.users[uid];
          return (
            <Draggable key={uid} draggableId={uid.toString()} index={index}>
              {provided => (
                <div 
                  ref={provided.innerRef} {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <UserCard 
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    type={props.type}
                    uid={uid} name={userData.name}
                    time={userData.joinTime} message={userData.message}  
                  />
                </div>
              )}
            </Draggable>
          )
          })}
          {provided.placeholder}
        </div>)
      }
    </Droppable>
  )
}

DroppableUserList.propTypes = {
  dropId: PropTypes.string,
  users: PropTypes.array,
  queueData: PropTypes.object,
  type: PropTypes.string
}

export default function Dashboard () {
  const qid = useParams().qid;
  const token = window.localStorage.getItem('token');
  const api = useContext(ApiContext);
  const socketApi = useRef(api.createSocket());
  const [ queueData, setQueueData ] = useState();
  const history = useHistory();
  const attachSocketHandlers = (socket) => {
    socket.on('queue:update', data => {
      setQueueData(data);
    })
  }
  /**
   * Loads the Page, gets status of queue, connect
   * to socket
   */
  const loadPage = useRef(async () => {
    // Get the status of the queue
    const response =  await api.queueStatus(qid);
    if (response.status === 400) {
      alert('Invalid qid')
      history.push('/');
      return;
    }
    // Load data
    const data = await response.json();
    setQueueData(data);
    // Connect to sockets
    const socket = await socketApi.current.connect(qid, token);
    attachSocketHandlers(socket);
  })
  
  /*
  * Load intial page
  */
  useEffect(() => { loadPage.current() }, [loadPage]);
  // Display loading page if there is no queuedata
  if (queueData === undefined) {
    return (
      <LoadingBackdrop open={true}/>
    );
  }
  /**
   * 
   * @param {*} users 
   * @param {*} dropId 
   * @returns 
   */
  const renderUsers = (users ,dropId, type) => {
    if (users.length === 0) {
      return (
        <Droppable droppableId={dropId}>
        {(provided) => (
          <div className={styles.emptyUsers}
            {...provided.droppableProps} ref={provided.innerRef}>
            {provided.placeholder}
          </div>)
        }
      </Droppable>
      )
    }
    return (
      <DroppableUserList type={type} dropId={dropId} users={users} queueData={queueData}/>
    )
  }
  const handleOnDragEnd = result => {
    if (result.source.droppableId === 'queueUsers') {
      if (result.destination.droppableId === 'servingUsers') {
        const token = window.localStorage.getItem('token');
        api.queueAdminServeUser(parseInt(result.draggableId),token, qid)
          .then(r => {
            if (r.status !== 200) {
              r.json()
                .then(r => alert(r.message));
            }
          })
      }
    }
  }
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className={styles.pageWrapper}>
        <div className={styles.sideBar}>Virtual Queue</div>
        <div className={styles.main}>
          <div className='page-title'>Dashboard</div>
          <LinkWidget link={`${window.location.origin}/virtual-queue/#/queue/${qid}`}/>
          <div className={styles.queueTitle}>
            {queueData.queue.name}
          </div>
          <div className={styles.stateTitle}>Serving</div>
          { renderUsers(queueData.queue.serving, 'servingUsers', 'serving') }
          <div className={styles.stateTitle}>Queue</div>
          { renderUsers(queueData.queue.queue, 'queueUsers', 'queue') }
        </div>
      </div>
    </DragDropContext>
  )
}