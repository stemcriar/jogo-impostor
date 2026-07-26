import { Server } from 'socket.io';
import { StateManager } from '../game/state-manager.js';
import { handleMentorEvents } from './mentor.ws.js';
import { handleStudentEvents } from './student.ws.js';
import { handleDashboardEvents } from './dashboard.ws.js';

export function setupWebSocket(server) {
  const io = new Server(server, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    // join_game accepts either a string (gameId) or object { gameId, role }
    socket.on('join_game', (data) => {
      const gameId = typeof data === 'string' ? data : data.gameId;
      socket.join(gameId);
      const game = StateManager.getGame(gameId);
      if (game) {
        socket.emit('sync:state', sanitizeGameState(game));
      }
    });

    socket.on('games:list', () => {
      const games = StateManager.getActiveGames().map(g => ({
        id: g.id,
        name: g.name,
        phase: g.phase,
        totalPlayers: g.totalPlayers
      }));
      socket.emit('games:active', games);
    });

    // sync:request accepts either a string or object { gameId, role }
    socket.on('sync:request', (data) => {
      const gameId = typeof data === 'string' ? data : data.gameId;
      const game = StateManager.getGame(gameId);
      if (game) {
        socket.emit('sync:state', sanitizeGameState(game));
      }
    });

    handleMentorEvents(io, socket);
    handleStudentEvents(io, socket);
    handleDashboardEvents(io, socket);
  });

  return io;
}

// Transforms internal game state into the shape the frontend expects
function sanitizeGameState(game) {
  if (!game) return null;
  
  const machinePlayerNumbers = Object.keys(game.roles)
    .filter(p => game.roles[p] === 'machine')
    .map(Number);

  return {
    id: game.id,
    name: game.name,
    phase: game.phase,
    totalPlayers: game.totalPlayers,
    impostorCount: game.impostorCount,
    word: game.word,
    roles: game.roles,
    speakingOrder: game.speakingOrder,
    machinePlayerNumbers,
    firstSpeaker: game.speakingOrder?.[0] || null,
    votes: game.votes || {},
    totalVotes: Object.values(game.votes || {}).reduce((a, b) => a + b, 0),
    result: game.result
  };
}

// Export for use by other WS handlers
export { sanitizeGameState };
