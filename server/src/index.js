import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import os from 'os';

import { config } from './config.js';
import { runMigrations } from './db/migrations.js';
import { seedDatabase } from './db/seed.js';
import { StateManager } from './game/state-manager.js';
import { setupWebSocket } from './ws/handler.js';

import authRoutes from './routes/auth.routes.js';
import wordRoutes from './routes/word.routes.js';
import gameRoutes from './routes/game.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function start() {
  runMigrations();
  seedDatabase();
  StateManager.init();

  const fastify = Fastify({ logger: false });

  await fastify.register(cors, { origin: '*' });

  const clientDist = path.resolve(__dirname, '../../client/dist');
  await fastify.register(fastifyStatic, {
    root: clientDist,
    wildcard: false // we'll handle SPA routing manually
  });

  fastify.register(authRoutes, { prefix: '/api/auth' });
  fastify.register(wordRoutes, { prefix: '/api/words' });
  fastify.register(gameRoutes, { prefix: '/api/games' });

  // SPA catch-all
  fastify.setNotFoundHandler((request, reply) => {
    if (request.url.startsWith('/api/')) {
      reply.status(404).send({ error: 'Not found' });
    } else {
      reply.sendFile('index.html');
    }
  });

  const server = fastify.server;
  setupWebSocket(server);

  try {
    await fastify.listen({ port: config.PORT, host: '0.0.0.0' });
    
    // Find local IP
    const interfaces = os.networkInterfaces();
    let localIp = 'localhost';
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          localIp = iface.address;
        }
      }
    }
    
    console.log(`\n======================================`);
    console.log(`App rodando em http://${localIp}:${config.PORT}`);
    console.log(`======================================\n`);
    
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();
