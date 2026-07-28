// ─── Game Logic (pure functions, no server) ──────────────────────────────────

/** Fisher-Yates shuffle — returns a new array */
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Builds a speaking order for N players where:
 *  - positions 0 and 1 (1st and 2nd speakers) are ALWAYS human players
 *  - machines only appear from position 2 onwards
 *
 * @param {number} totalPlayers  — total number of players (N)
 * @param {number[]} machineNums — array of machine player numbers (1-indexed)
 * @returns {number[]}           — ordered array of player numbers
 */
export function buildSpeakingOrder(totalPlayers, machineNums) {
  const machineSet = new Set(machineNums);
  const humans  = [];
  const machines = [];

  for (let i = 1; i <= totalPlayers; i++) {
    if (machineSet.has(i)) machines.push(i);
    else humans.push(i);
  }

  const shuffledHumans  = shuffle(humans);
  const shuffledMachines = shuffle(machines);

  // First 2 slots are guaranteed humans; rest is shuffled remainder
  const firstTwo   = shuffledHumans.slice(0, 2);
  const restHumans = shuffledHumans.slice(2);
  const rest       = shuffle([...restHumans, ...shuffledMachines]);

  return [...firstTwo, ...rest];
}

/**
 * Picks a random word excluding already-used IDs.
 * If all words have been used, resets the used list and picks freely.
 *
 * @param {object[]} words       — full word list from storage
 * @param {number[]} usedWordIds — IDs already used in previous rounds
 * @returns {object}             — chosen word object
 */
export function pickWord(words, usedWordIds = []) {
  const available = words.filter(w => !usedWordIds.includes(w.id));
  const pool = available.length > 0 ? available : words; // reset if exhausted
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Picks K unique machine player numbers from 1..N.
 *
 * @param {number} totalPlayers
 * @param {number} impostorCount
 * @returns {number[]}
 */
export function pickMachines(totalPlayers, impostorCount) {
  const all = Array.from({ length: totalPlayers }, (_, i) => i + 1);
  return shuffle(all).slice(0, impostorCount);
}

/**
 * Builds a complete new GameState from setup parameters.
 *
 * @param {object} opts
 * @param {string} opts.name         — room/class name
 * @param {number} opts.totalPlayers
 * @param {number} opts.impostorCount
 * @param {object} opts.word         — {id, keyword, hint}
 * @param {number[]} opts.usedWordIds
 * @returns {object}                 — full GameState to persist in storage
 */
export function createGameState({ name, totalPlayers, impostorCount, word, usedWordIds = [] }) {
  const machinePlayerNumbers = pickMachines(totalPlayers, impostorCount);
  const speakingOrder = buildSpeakingOrder(totalPlayers, machinePlayerNumbers);

  return {
    id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substring(2),
    name,
    phase: 'card_reveal',
    totalPlayers,
    impostorCount,
    word,
    machinePlayerNumbers,
    speakingOrder,
    firstSpeaker: speakingOrder[0],
    usedWordIds: [...usedWordIds, word.id],
    createdAt: new Date().toISOString(),
  };
}
