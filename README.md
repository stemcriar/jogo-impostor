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

Para simplificar, o projeto possui um gerenciador de execução unificado na raiz do repositório. Siga os passos:

1. **Instale todas as dependências**:
   Abra o terminal na raiz do projeto (`jogo-impostor`) e instale tanto o frontend quanto o backend de uma vez:
   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install
   cd ..
   ```

2. **(Opcional) Variáveis de Ambiente**:
   Copie o arquivo `.env.example` para `.env` na raiz do projeto se quiser customizar os PINs:
   ```bash
   cp .env.example .env
   ```

3. **Inicie o ambiente de desenvolvimento**:
   Ainda na raiz do projeto, inicie os servidores (backend e frontend iniciarão juntos):
   ```bash
   npm run dev
   ```
   * O Frontend (Vite) rodará em `http://localhost:5173`
   * O Backend (Fastify/Sockets) rodará em `http://localhost:3000`

## Como Executar (Produção / Raspberry Pi)

Quando for hospedar o projeto definitivamente na rede local (ex: Raspberry Pi):

1. **Faça o build e inicie o servidor unificado**:
   Na raiz do projeto, rode:
   ```bash
   npm run build
   npm start
   ```
   *O comando `build` compila o frontend e o comando `start` sobe o backend na porta `3000`, servindo os arquivos estáticos na rede.*

2. **Acesso pela Rede**:
   O terminal exibirá o seu IP local (ex: `http://192.168.1.100:3000`). Forneça este link aos alunos e abra nos dispositivos (celular do mentor e projeção).

## PINs de Acesso Padrão

Caso não sejam alterados no `.env`, os PINs padrão são:
- **Painel do Mentor**: `87654321` (Acesso para gerenciar e criar partidas).
- **Dashboard de Projeção**: `12344321` (Tela grande para acompanhamento dos alunos).
