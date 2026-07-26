import db from '../db/connection.js';

export const GameModel = {
  create(game) {
    const { id, name, totalPlayers, impostorCount, wordId, phase, rolesJson, speakingOrder, result } = game;
    db.prepare(`
      INSERT INTO games (id, name, total_players, impostor_count, word_id, phase, roles_json, speaking_order, result)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, totalPlayers, impostorCount, wordId, phase, rolesJson, speakingOrder, result);
    return this.getById(id);
  },
  update(id, data) {
    const keys = Object.keys(data);
    if (keys.length === 0) return this.getById(id);
    const sets = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => data[k]);
    db.prepare(`UPDATE games SET ${sets} WHERE id = ?`).run(...values, id);
    return this.getById(id);
  },
  getById(id) {
    return db.prepare('SELECT * FROM games WHERE id = ?').get(id);
  },
  getActive() {
    return db.prepare("SELECT * FROM games WHERE phase != 'result'").all();
  },
  getAll() {
    return db.prepare('SELECT * FROM games').all();
  },
  remove(id) {
    const deleteGameTransaction = db.transaction((gameId) => {
      db.prepare('DELETE FROM votes WHERE game_id = ?').run(gameId);
      db.prepare('DELETE FROM games WHERE id = ?').run(gameId);
    });
    deleteGameTransaction(id);
    return true;
  }
};
