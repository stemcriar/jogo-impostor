import { StateManager } from '../game/state-manager.js';
import { sanitizeGameState } from './handler.js';

export function handleStudentEvents(io, socket) {
  socket.on('vote:cast', ({ gameId, voterDeviceId, votedPlayer }) => {
    const game = StateManager.getGame(gameId);
    
    if (!game) {
      return socket.emit('vote:rejected', { gameId, reason: 'Jogo não encontrado' });
    }
    if (game.phase !== 'voting') {
      return socket.emit('vote:rejected', { gameId, reason: 'Votação não está aberta' });
    }
    if (votedPlayer < 1 || votedPlayer > game.totalPlayers) {
      return socket.emit('vote:rejected', { gameId, reason: 'Jogador inválido' });
    }

    const res = StateManager.addVote(gameId, voterDeviceId, votedPlayer);
    if (res.success) {
      socket.emit('vote:accepted', { gameId, votedPlayer });
      const state = sanitizeGameState(game);
      io.to(gameId).emit('vote:update', { 
        gameId, 
        votes: state.votes, 
        totalVotes: state.totalVotes 
      });
      io.to(gameId).emit('sync:state', state);
    } else {
      socket.emit('vote:rejected', { gameId, reason: res.error });
    }
  });
}
