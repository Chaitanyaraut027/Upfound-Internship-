import { Server } from 'socket.io';

let ioInstance = null;

export function initSocket(server) {
  ioInstance = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  ioInstance.on('connection', (socket) => {
    socket.on('disconnect', () => {});
  });

  return ioInstance;
}

export function getIO() {
  if (!ioInstance) {
    throw new Error('Socket.IO is not initialized');
  }
  return ioInstance;
}

export function emitNewLead(lead) {
  if (ioInstance) {
    ioInstance.emit('new_lead', lead);
  }
}
