import authUrl from './utils';

const SOCKET_OPEN = 'SOCKET_OPEN'
const SOCKET_CLOSE = 'SOCKET_CLOSE'

class Client {
  constructor() {
    this.socket = null
    this.socketState = SOCKET_CLOSE
  }

  async request(path, method='GET', body=null) {
    if (!window.localStorage.getItem('access_token')) {
      return
    }
    if (body) {
      body = JSON.stringify(body)
    }
    let url = `${process.env.REACT_APP_SCHEMA}://${process.env.REACT_APP_BACKEND_BASE}/${path}` 
    const resp = await fetch(
      authUrl(url), 
      {
        method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body
      }
    )
    if (resp.status === 401) {  
      window.localStorage.removeItem('access_token')
      return
    }
    return (await resp.json())
  } 

  async getMe() {
    return this.request('api/profiles/me')  
  }

  async getInfo(uid) {
    return this.request(`api/profiles/${uid}`)  
  }

  async getCurrentRide() {
    return this.request('api/rides/current')
  }

  async setRole(role, destination) {
    return this.request('api/rides/join', 'POST', {
      role,
      destination
    })
  }

  connect()  {
    this.socket = new WebSocket(authUrl(process.env.REACT_APP_STREAM_WS));
    
    this.socket.onopen = function() {
      console.log("Socket opened");
      this.socketState = SOCKET_OPEN
    };
    
    this.socket.onclose = function(event) {
      if (event.wasClean) {
        console.log('Socket closed normaly');
      } else {
        console.log('Socket closed with errors');
      }
      this.socketState = SOCKET_CLOSE
    };
    
    this.socket.onmessage = function(event) {
      console.log(event.data)
    };
    
    this.socket.onerror = function(error) {
      alert("Ошибка " + error.message);
    };
  }

  sendLocation(position) {
    if (this.socketState === SOCKET_OPEN) {
      this.socket.send(JSON.stringify({
        type: 'LOCATION', 
        data: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude, 
          course: position.coords.heading,
          speed: position.coords.speed
        }
      }))
    }
  };

  leave() {
    this.request('/api/rides/leave', 'delete')
  }
}

export default new Client()