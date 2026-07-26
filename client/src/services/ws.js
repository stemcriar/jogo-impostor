import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000';

export const socket = io(URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});

export const wsService = {
  connect: () => {
    if (!socket.connected) {
      socket.connect();
    }
  },
  
  disconnect: () => {
    if (socket.connected) {
      socket.disconnect();
    }
  },
  
  joinGame: (gameId, role) => {
    socket.emit('join_game', { gameId, role });
  },
  
  requestSync: (gameId, role) => {
    socket.emit('sync:request', { gameId, role });
  },
  
  requestGamesList: () => {
    socket.emit('games:list', {});
  },
  
  castVote: (gameId, voterDeviceId, votedPlayer) => {
    socket.emit('vote:cast', { gameId, voterDeviceId, votedPlayer });
  }
};
