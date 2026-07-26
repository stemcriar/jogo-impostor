import db from './connection.js';
import { config } from '../config.js';

export function runMigrations() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      keyword TEXT NOT NULL,
      hint TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      name TEXT,
      total_players INTEGER NOT NULL,
      impostor_count INTEGER NOT NULL,
      word_id INTEGER,
      phase TEXT DEFAULT 'setup',
      roles_json TEXT NOT NULL,
      speaking_order TEXT NOT NULL,
      result TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (word_id) REFERENCES words (id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id TEXT NOT NULL,
      voter_device_id TEXT NOT NULL,
      voted_player INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (game_id) REFERENCES games (id) ON DELETE CASCADE,
      UNIQUE (game_id, voter_device_id)
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  insertSetting.run('MENTOR_PIN', config.MENTOR_PIN);
  insertSetting.run('DASHBOARD_PIN', config.DASHBOARD_PIN);
}
