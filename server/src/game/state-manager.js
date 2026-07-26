import { GameModel } from '../models/game.model.js';
import { VoteModel } from '../models/vote.model.js';
import { WordModel } from '../models/word.model.js';
import { generateGameId } from '../utils/id-generator.js';
import { assignRoles } from './role-assigner.js';
import { generateSpeakingOrder } from './speaking-order.js';

const activeGames = new Map();

function restoreGames() {
  const games = GameModel.getActive();
  games.forEach(g => {
    const word = g.word_id ? WordModel.getById(g.word_id) : null;
    activeGames.set(g.id, {
      id: g.id,
      name: g.name,
      totalPlayers: g.total_players,
      impostorCount: g.impostor_count,
      wordId: g.word_id,
      word: word ? { keyword: word.keyword, hint: word.hint } : null,
      phase: g.phase,
      roles: JSON.parse(g.roles_json),
      speakingOrder: JSON.parse(g.speaking_order),
      result: g.result ? JSON.parse(g.result) : null,
      votes: VoteModel.countByGame(g.id)
    });
  });
}

export const StateManager = {
  init() {
    restoreGames();
  },
  createGame({ name, totalPlayers, impostorCount, wordId }) {
    const id = generateGameId();
    const roles = assignRoles(totalPlayers, impostorCount);
    const speakingOrder = generateSpeakingOrder(roles);
    const word = wordId ? WordModel.getById(wordId) : WordModel.getRandom();

    const game = {
      id,
      name: name || `Game ${id}`,
      totalPlayers,
      impostorCount,
      wordId: word ? word.id : null,
      word: word ? { keyword: word.keyword, hint: word.hint } : null,
      phase: 'setup',
      roles,
      speakingOrder,
      result: null,
      votes: {}
    };

    GameModel.create({
      id,
      name: game.name,
      totalPlayers,
      impostorCount,
      wordId: game.wordId,
      phase: game.phase,
      rolesJson: JSON.stringify(roles),
      speakingOrder: JSON.stringify(speakingOrder),
      result: null
    });

    activeGames.set(id, game);
    return game;
  },
  getGame(id) {
    return activeGames.get(id);
  },
  updatePhase(id, phase) {
    const game = activeGames.get(id);
    if (!game) return null;
    game.phase = phase;
    GameModel.update(id, { phase });
    return game;
  },
  addVote(gameId, voterDeviceId, votedPlayer) {
    const game = activeGames.get(gameId);
    if (!game) return { success: false, error: 'Game not found' };
    const res = VoteModel.cast(gameId, voterDeviceId, votedPlayer);
    if (res.success) {
      game.votes = VoteModel.countByGame(gameId);
    }
    return res;
  },
  calculateResult(gameId) {
    const game = activeGames.get(gameId);
    if (!game) return null;
    
    let maxVotes = -1;
    let mostVoted = null;
    for (const [player, count] of Object.entries(game.votes)) {
      if (count > maxVotes) {
        maxVotes = count;
        mostVoted = Number(player);
      } else if (count === maxVotes) {
        mostVoted = null; // tie
      }
    }

    let winner;
    if (mostVoted !== null && game.roles[mostVoted] === 'machine') {
      winner = 'humans_win';
    } else {
      winner = 'machine_wins';
    }

    const word = WordModel.getById(game.wordId);
    
    game.result = {
      winner,
      mostVoted,
      word: word ? word.keyword : null,
      hint: word ? word.hint : null,
      machines: Object.keys(game.roles).filter(p => game.roles[p] === 'machine').map(Number)
    };
    game.phase = 'result';

    GameModel.update(gameId, { 
      phase: 'result', 
      result: JSON.stringify(game.result) 
    });

    return game;
  },
  resetForNewRound(gameId, options = {}) {
    const game = activeGames.get(gameId);
    if (!game) return null;
    
    if (options.totalPlayers) game.totalPlayers = options.totalPlayers;
    if (options.impostorCount) game.impostorCount = options.impostorCount;

    const wordId = options.wordId;
    const word = wordId ? WordModel.getById(wordId) : WordModel.getRandom(game.wordId);
    game.wordId = word ? word.id : null;
    game.word = word ? { keyword: word.keyword, hint: word.hint } : null;
    game.phase = 'card_reveal';
    game.votes = {};
    game.result = null;

    VoteModel.deleteByGame(gameId);

    game.roles = assignRoles(game.totalPlayers, game.impostorCount);
    game.speakingOrder = generateSpeakingOrder(game.roles);

    GameModel.update(gameId, {
      total_players: game.totalPlayers,
      impostor_count: game.impostorCount,
      word_id: game.wordId,
      phase: game.phase,
      roles_json: JSON.stringify(game.roles),
      speaking_order: JSON.stringify(game.speakingOrder),
      result: null
    });

    return game;
  },
  deleteGame(gameId) {
    activeGames.delete(gameId);
    GameModel.remove(gameId);
  },
  getActiveGames() {
    return Array.from(activeGames.values());
  }
};
