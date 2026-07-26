import db from './connection.js';

export function seedDatabase() {
  const count = db.prepare('SELECT COUNT(*) as count FROM words').get().count;
  if (count > 0) return;

  const words = [
    { keyword: 'Bateria', hint: 'Instrumento' },
    { keyword: 'Quadro', hint: 'Decoração' },
    { keyword: 'Memória', hint: 'Mente' },
    { keyword: 'Massa', hint: 'Comida' },
    { keyword: 'Foco', hint: 'Luz' },
    { keyword: 'Rede', hint: 'Balanço' },
    { keyword: 'Manga', hint: 'Fruta' },
    { keyword: 'Banco', hint: 'Dinheiro' },
    { keyword: 'Ponto', hint: 'Costura' },
    { keyword: 'Linha', hint: 'Costura' },
    { keyword: 'Pasta', hint: 'Arquivo' }
  ];

  const insert = db.prepare('INSERT INTO words (keyword, hint) VALUES (?, ?)');
  const transaction = db.transaction((words) => {
    for (const w of words) insert.run(w.keyword, w.hint);
  });
  transaction(words);
}
