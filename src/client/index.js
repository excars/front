import authUrl from './utils';

class Client {
  constructor() {
    this.socket = null
  }

  async request(url, method='GET', body=null) {
    if (!window.localStorage.getItem('access_token')) {
      return
    }
    const resp = await fetch(
      authUrl(url), 
      {method, body}
    )
    if (resp.status === 401) {  
      window.localStorage.removeItem('access_token')
      return
    }
    return (await resp.json())
  } 

  async getMe() {
    return this.request(process.env.REACT_APP_ME_URL)  
  }

  async setRole(role, destination) {
    return this.request(process.env.REACT_APP_SET_ROLE_URL, 'POST', {
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
}

export default new Client()