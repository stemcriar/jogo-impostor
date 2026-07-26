import db from './connection.js';

export function seedDatabase() {
  const count = db.prepare('SELECT COUNT(*) as count FROM words').get().count;
  if (count > 0) return;

  const words = [
    { keyword: 'Banana', hint: 'Fruta amarela' },
    { keyword: 'Futebol', hint: 'Esporte com bola' },
    { keyword: 'Sol', hint: 'Estrela mais próxima' },
    { keyword: 'Cachorro', hint: 'Melhor amigo do homem' },
    { keyword: 'Pizza', hint: 'Comida italiana redonda' },
    { keyword: 'Computador', hint: 'Máquina de processar dados' },
    { keyword: 'Brasil', hint: 'País do samba' },
    { keyword: 'Violão', hint: 'Instrumento de 6 cordas' },
    { keyword: 'Leão', hint: 'Rei da selva' },
    { keyword: 'Água', hint: 'Líquido essencial' },
    { keyword: 'Avião', hint: 'Veículo que voa' },
    { keyword: 'Gato', hint: 'Felino doméstico' },
    { keyword: 'Café', hint: 'Bebida escura e quente' },
    { keyword: 'Livro', hint: 'Objeto com páginas para ler' },
    { keyword: 'Celular', hint: 'Aparelho de comunicação portátil' },
    { keyword: 'Mar', hint: 'Grande extensão de água salgada' }
  ];

  const insert = db.prepare('INSERT INTO words (keyword, hint) VALUES (?, ?)');
  const transaction = db.transaction((words) => {
    for (const w of words) insert.run(w.keyword, w.hint);
  });
  transaction(words);
}
