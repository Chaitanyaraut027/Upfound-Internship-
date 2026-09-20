import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config';

let socket = null;

export function connectSocket(onConnect, onDisconnect, onNewLead) {
  if (socket) {
    socket.disconnect();
  }

  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    extraHeaders: {
      'ngrok-skip-browser-warning': 'true'
    },
    reconnectionAttempts: 10,
    reconnectionDelay: 2000
  });

  socket.on('connect', () => {
    if (onConnect) onConnect();
  });

  socket.on('disconnect', () => {
    if (onDisconnect) onDisconnect();
  });

  socket.on('new_lead', (lead) => {
    if (onNewLead) onNewLead(lead);
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
