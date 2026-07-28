# Impostor de Turing (STEM Criar)

Um aplicativo web interativo inspirado no "Teste de Turing", projetado para dinâmicas de sala de aula e desenvolvido para o projeto **STEM Criar**.

## Sobre o Jogo

O "Impostor de Turing" coloca alunos em um cenário investigativo onde devem descobrir quem são as "máquinas" escondidas entre os "humanos".
- **Humanos** recebem uma palavra-chave secreta.
- **Máquinas** recebem apenas uma dica vaga sobre a palavra.
- Através de perguntas e respostas, todos tentam identificar a máquina, enquanto a máquina tenta deduzir a palavra-chave e se passar por humano.

O sistema é gerido localmente via Wi-Fi e substitui os antigos papéis impressos por um fluxo digital via "passa o celular".

## Arquitetura

Esta é uma versão simplificada e estática (sem backend) do [https://github.com/stemcriar/jogo-impostor-carreta](https://github.com/stemcriar/jogo-impostor-carreta), esse sistema utiliza:
- **Framework**: React 19 + Vite 8
- **Persistência**: `localStorage` nativo (sem banco de dados relacional ou servidor)
- **Estilo**: Tailwind CSS 4 + Framer Motion
- **Deploy Alvo**: GitHub Pages (ou qualquer servidor de arquivos estáticos local)

## Como Executar (Desenvolvimento Local)

1. **Instale as dependências**:
   Abra o terminal na raiz do projeto e instale:
   ```bash
   npm install
   ```

2. **Inicie o ambiente de desenvolvimento**:
   ```bash
   npm run dev
   ```
   O Frontend rodará em algo como `http://localhost:5173` ou `http://localhost:5173/jogo-impostor/`

## Como Publicar (GitHub Pages / Estático)

Para hospedar o projeto estático gratuitamente (ou servir num Raspberry Pi sem Node):

1. **Faça o build**:
   ```bash
   npm run build
   ```
2. O conteúdo da pasta `dist/` gerada está pronto para ser hospedado no GitHub Pages, Vercel, Netlify, ou servido via Nginx/Apache.

## PIN de Acesso Padrão

Nesta versão, o PIN é fixo no código para simplicidade:
- **Painel do Mentor**: `87654321` (Acesso exclusivo para criar e gerenciar a partida).
