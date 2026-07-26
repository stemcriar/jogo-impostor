import { StateManager } from '../game/state-manager.js';
import { GameModel } from '../models/game.model.js';
import { sanitizeGameState } from './handler.js';

export function handleMentorEvents(io, socket) {
  const broadcastState = (gameId) => {
    const game = StateManager.getGame(gameId);
    if (game) {
      const state = sanitizeGameState(game);
      io.to(gameId).emit('sync:state', state);
    }
  };

  // game:start_cards accepts string or { gameId }
  socket.on('game:start_cards', (data) => {
    const gameId = typeof data === 'string' ? data : data.gameId;
    StateManager.updatePhase(gameId, 'card_reveal');
    broadcastState(gameId);
  });

  socket.on('game:card_revealed', (data) => {
    const gameId = typeof data === 'string' ? data : data.gameId;
    io.to(gameId).emit('game:card_revealed', { player: data.player });
  });

  // game:cards_done accepts string or { gameId }
  socket.on('game:cards_done', (data) => {
    const gameId = typeof data === 'string' ? data : data.gameId;
    StateManager.updatePhase(gameId, 'round');
    broadcastState(gameId);
  });

  // game:open_voting accepts string or { gameId }
  socket.on('game:open_voting', (data) => {
    const gameId = typeof data === 'string' ? data : data.gameId;
    StateManager.updatePhase(gameId, 'voting');
    broadcastState(gameId);
  });

  // game:close_voting accepts string or { gameId }
  socket.on('game:close_voting', (data) => {
    const gameId = typeof data === 'string' ? data : data.gameId;
    const game = StateManager.calculateResult(gameId);
    if (game) {
      const state = sanitizeGameState(game);
      io.to(gameId).emit('sync:state', state);
      io.to(gameId).emit('game:result', state.result);
    }
  });

  // game:new_round accepts { gameId, wordId? }
  socket.on('game:new_round', (data) => {
    const gameId = typeof data === 'string' ? data : data.gameId;
    const wordId = data?.wordId;
    StateManager.resetForNewRound(gameId, wordId);
    broadcastState(gameId);
  });

  // game:action — unified action handler for frontend convenience
  socket.on('game:action', (data) => {
    const { gameId, action } = data;
    switch (action) {
      case 'open_voting':
        StateManager.updatePhase(gameId, 'voting');
        broadcastState(gameId);
        break;
      case 'close_voting': {
        const game = StateManager.calculateResult(gameId);
        if (game) {
          const state = sanitizeGameState(game);
          io.to(gameId).emit('sync:state', state);
          io.to(gameId).emit('game:result', state.result);
        }
        break;
      }
      case 'new_round':
        StateManager.resetForNewRound(gameId, data.wordId);
        broadcastState(gameId);
        break;
      case 'restart_cards':
        StateManager.updatePhase(gameId, 'card_reveal');
        broadcastState(gameId);
        break;
      case 'delete_game':
        StateManager.deleteGame(gameId);
        GameModel.remove(gameId);
        io.to(gameId).emit('game:deleted');
        // A desconexão e saída da sala serão gerenciadas no frontend
        break;
    }
  });
}
