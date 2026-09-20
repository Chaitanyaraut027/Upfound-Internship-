const { Server } = require('socket.io');

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    socket.on('disconnect', () => {});
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}

function emitNewLead(lead) {
  if (io) {
    io.emit('new_lead', lead);
  }
}

module.exports = {
  initSocket,
  getIO,
  emitNewLead
};
