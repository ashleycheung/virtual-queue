import { io } from 'socket.io-client';

export default class SocketAPI {
  constructor (url) {
    this.socket = io(url, { autoConnect: false })
  }
  
  connect(qid, token) {
    this.socket.disconnect();
    return new Promise((resolve, reject) => {
      // Try to connect
      this.socket.auth = { qid, token };
      // When connected to socket returns the socket
      this.socket.on('connect', () => {
        resolve(this.socket)
      })
      this.socket.connect();
    })
  }
}