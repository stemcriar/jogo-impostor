# Impostor de Turing (STEM Criar)

Um aplicativo web interativo inspirado no "Teste de Turing", projetado para dinâmicas de sala de aula e desenvolvido para o projeto **STEM Criar**.

## Sobre o Jogo

O "Impostor de Turing" coloca alunos em um cenário investigativo onde devem descobrir quem são as "máquinas" escondidas entre os "humanos".
- **Humanos** recebem uma palavra-chave secreta.
- **Máquinas** recebem apenas uma dica vaga sobre a palavra.
- Através de perguntas e respostas, todos tentam identificar a máquina, enquanto a máquina tenta deduzir a palavra-chave e se passar por humano.

O sistema é gerido localmente via Wi-Fi e substitui os antigos papéis impressos por um fluxo digital via "passa o celular".

## Arquitetura

O sistema utiliza arquitetura cliente-servidor construída em:
- **Backend**: Node.js + Fastify, SQLite (better-sqlite3), Socket.IO.
- **Frontend**: React + Vite + Tailwind CSS v4 + Framer Motion.
- **Deploy Alvo**: Raspberry Pi rodando em uma rede LAN educacional.

## Como Executar (Desenvolvimento)

1. **Instale as dependências**:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

2. **Inicie o ambiente de desenvolvimento**:
   Na raiz do projeto (ou dentro da pasta `client`), inicie os servidores:
   ```bash
   npm run dev
   ```
   Isso iniciará o Vite e o servidor Fastify simultaneamente.

## Como Executar (Produção / Raspberry Pi)

1. **Faça o build do frontend**:
   ```bash
   cd client
   npm run build
   ```
   *Isso irá gerar a pasta estática `dist/`.*

2. **Inicie o servidor de produção**:
   ```bash
   cd ../server
   npm start
   ```
   O servidor irá automaticamente servir os arquivos do `client/dist/` e exibir no console o IP local (ex: `http://192.168.1.100:3000`), para onde todos os alunos e monitores deverão acessar.

## PINs de Acesso Padrão

Caso não alterados no `.env`, os PINs padrão são:
- **Painel do Mentor**: `87654321` (Acesso para gerenciar e criar partidas).
- **Dashboard de Projeção**: `12344321` (Tela grande para acompanhamento dos alunos).
