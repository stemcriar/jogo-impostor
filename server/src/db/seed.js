import db from './connection.js';

export function seedDatabase() {
  const count = db.prepare('SELECT COUNT(*) as count FROM words').get().count;
  if (count > 0) return;

  const words = [
    { keyword: 'Bateria', hint: 'instrumento' },
    { keyword: 'Quadro', hint: 'decoração' },
    { keyword: 'Memória', hint: 'mente' },
    { keyword: 'Massa', hint: 'comida' },
    { keyword: 'Foco', hint: 'luz' },
    { keyword: 'Rede', hint: 'balanço' },
    { keyword: 'Manga', hint: 'fruta' },
    { keyword: 'Banco', hint: 'dinheiro' },
    { keyword: 'Ponto', hint: 'costura' },
    { keyword: 'Linha', hint: 'costura' },
    { keyword: 'Pasta', hint: 'arquivo' }
  ];

  const insert = db.prepare('INSERT INTO words (keyword, hint) VALUES (?, ?)');
  const transaction = db.transaction((words) => {
    for (const w of words) insert.run(w.keyword, w.hint);
  });
  transaction(words);
}
