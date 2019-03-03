import authUrl from './utils';

class Client {
  constructor() {
    this.socket = null
  }

  async request(path, method='GET', body=null) {
    if (!window.localStorage.getItem('access_token')) {
      return
    }
    if (body) {
      body = JSON.stringify(body)
    }
    let url = `${process.env.SCHEMA}://${process.env.BACKEND_BASE}/${path}` 
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

  async setRole(role, destination) {
    return this.request('api/rides/join', 'POST', {
      role,
      destination
    })
  }

  connect(onOpen, onClose)  {
    this.socket = new WebSocket(authUrl(process.env.REACT_APP_STREAM_WS));
    
    this.socket.onopen = function() {
      console.log("Соединение установлено.");
      onOpen()
    };
    
    this.socket.onclose = function(event) {
      if (event.wasClean) {
        alert('Соединение закрыто чисто');
      } else {
        console.log('Обрыв соединения'); // например, "убит" процесс сервера
      }
      console.log('Код: ' + event.code + ' причина: ' + event.reason);
  
      onClose()
    };
    
    this.socket.onmessage = function(event) {
      console.log(event.data)
      // alert("Получены данные " + event.data);
    };
    
    this.socket.onerror = function(error) {
      alert("Ошибка " + error.message);
    };
  }

  sendLocation(position) {
    this.socket.send(JSON.stringify({
      type: 'LOCATION', 
      data: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude, 
        course: position.coords.heading,
        speed: position.coords.speed
      }
    }))
  };

  leave() {
    this.request('/api/rides/leave', 'delete')
  }
}

export default new Client()