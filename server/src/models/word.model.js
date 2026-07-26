import db from '../db/connection.js';

export const WordModel = {
  getAll() {
    return db.prepare('SELECT * FROM words').all();
  },
  getById(id) {
    return db.prepare('SELECT * FROM words WHERE id = ?').get(id);
  },
  create({ keyword, hint }) {
    const info = db.prepare('INSERT INTO words (keyword, hint) VALUES (?, ?)').run(keyword, hint);
    return this.getById(info.lastInsertRowid);
  },
  update(id, { keyword, hint }) {
    db.prepare('UPDATE words SET keyword = ?, hint = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(keyword, hint, id);
    return this.getById(id);
  },
  remove(id) {
    db.prepare('DELETE FROM words WHERE id = ?').run(id);
    return true;
  },
  getRandom(excludeId = null) {
    if (excludeId) {
      return db.prepare('SELECT * FROM words WHERE id != ? ORDER BY RANDOM() LIMIT 1').get(excludeId) || this.getRandom();
    }
    return db.prepare('SELECT * FROM words ORDER BY RANDOM() LIMIT 1').get();
  }
};
