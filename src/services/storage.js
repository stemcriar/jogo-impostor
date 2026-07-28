import defaultWords from '../data/defaultWords.json';

// ─── Storage Keys ────────────────────────────────────────────────────────────
const KEYS = {
  WORDS: 'impostor_words',
  GAME:  'impostor_active_game',
  AUTH:  'impostor_auth',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const read  = (key) => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } };
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const clear = (key) => localStorage.removeItem(key);

// ─── Words ───────────────────────────────────────────────────────────────────
function initWords() {
  if (!localStorage.getItem(KEYS.WORDS)) {
    write(KEYS.WORDS, defaultWords);
  }
}

export const storage = {
  // ── Words ──────────────────────────────────────────────────────────────────
  getWords() {
    initWords();
    return read(KEYS.WORDS) ?? [];
  },

  addWord(keyword, hint) {
    const words = this.getWords();
    const id = Date.now();
    const newWord = { id, keyword: keyword.trim(), hint: hint.trim() };
    write(KEYS.WORDS, [...words, newWord]);
    return newWord;
  },

  updateWord(id, keyword, hint) {
    const words = this.getWords().map(w =>
      w.id === id ? { ...w, keyword: keyword.trim(), hint: hint.trim() } : w
    );
    write(KEYS.WORDS, words);
    return words.find(w => w.id === id);
  },

  deleteWord(id) {
    write(KEYS.WORDS, this.getWords().filter(w => w.id !== id));
  },

  // ── Active Game ────────────────────────────────────────────────────────────
  getActiveGame() {
    return read(KEYS.GAME);
  },

  saveGame(state) {
    write(KEYS.GAME, state);
  },

  updateGame(patch) {
    const current = this.getActiveGame();
    if (current) write(KEYS.GAME, { ...current, ...patch });
  },

  clearGame() {
    clear(KEYS.GAME);
  },

  // ── Auth ───────────────────────────────────────────────────────────────────
  getAuth() {
    return localStorage.getItem(KEYS.AUTH); // string 'mentor' or null
  },

  setAuth(role) {
    localStorage.setItem(KEYS.AUTH, role);
  },

  clearAuth() {
    clear(KEYS.AUTH);
  },
};
