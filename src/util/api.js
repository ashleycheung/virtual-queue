import { createContext } from "react";
import SocketAPI from "./socketApi";

export const ApiContext = createContext();

export default class API {
  constructor (url) {
    this.url = url;
  }
  
  createSocket () {
    return new SocketAPI(this.url);
  }
  
  queueJoin (qid, name, message) {
    return fetch(`${this.url}/queue/join`, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        qid: qid,
        name: name,
        message: message
      })
    });
  }
  
  queueStatus (qid) {
    return fetch(`${this.url}/queue/status?qid=${qid}`);
  }
  
  queueAdminCreate (name, qName) {
    return fetch(`${this.url}/queue/admin/create`, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        name: name,
        qName: qName
      })
    });
  }
  
  queueAdminRemoveUser (uid, token, qid) {
    return fetch(`${this.url}/queue/admin/removeuser`, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        uid: uid,
        token: token,
        qid: qid
      })
    });
  }
  
  queueAdminServeUser (uid, token, qid) {
    return fetch(`${this.url}/queue/admin/serveuser`, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        uid: uid,
        token: token,
        qid: qid
      })
    });
  }
  
  queueAdminCompleteUser (uid, token, qid) {
    return fetch(`${this.url}/queue/admin/completeuser`, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        uid: uid,
        token: token,
        qid: qid
      })
    });
  }
}