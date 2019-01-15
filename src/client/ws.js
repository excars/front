import { authUrl } from './utils'

export default (onOpen, onClose) => {
  const socket = new WebSocket(authUrl(process.env.REACT_APP_STREAM_WS));
  
  socket.onopen = function() {
    console.log("Соединение установлено.");
    onOpen()
  };
  
  socket.onclose = function(event) {
    if (event.wasClean) {
      alert('Соединение закрыто чисто');
    } else {
      console.log('Обрыв соединения'); // например, "убит" процесс сервера
    }
    console.log('Код: ' + event.code + ' причина: ' + event.reason);
    onClose()
  };
  
  socket.onmessage = function(event) {
    alert("Получены данные " + event.data);
  };
  
  socket.onerror = function(error) {
    alert("Ошибка " + error.message);
  };
  return socket;
}

export const sendLocation = (position, socket) => {
  socket.send(JSON.stringify({
    type: 'LOCATION', 
    data: {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude, 
      course: position.coords.heading,
      speed: position.coords.speed
    }
  }))
}