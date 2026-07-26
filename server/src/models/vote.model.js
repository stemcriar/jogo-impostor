import db from '../db/connection.js';

export const VoteModel = {
  cast(gameId, voterDeviceId, votedPlayer) {
    try {
      const info = db.prepare('INSERT INTO votes (game_id, voter_device_id, voted_player) VALUES (?, ?, ?)')
        .run(gameId, voterDeviceId, votedPlayer);
      return { success: true, id: info.lastInsertRowid };
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return { success: false, error: 'Already voted' };
      }
      throw err;
    }
  },
  getByGame(gameId) {
    return db.prepare('SELECT * FROM votes WHERE game_id = ?').all(gameId);
  },
  countByGame(gameId) {
    const votes = this.getByGame(gameId);
    const counts = {};
    for (const v of votes) {
      counts[v.voted_player] = (counts[v.voted_player] || 0) + 1;
    }
    return counts;
  },
  deleteByGame(gameId) {
    db.prepare('DELETE FROM votes WHERE game_id = ?').run(gameId);
  },
  hasVoted(gameId, voterDeviceId) {
    const vote = db.prepare('SELECT 1 FROM votes WHERE game_id = ? AND voter_device_id = ?').get(gameId, voterDeviceId);
    return !!vote;
  }
};
