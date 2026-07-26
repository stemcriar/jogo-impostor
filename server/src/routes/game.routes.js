import { StateManager } from '../game/state-manager.js';
import { validateGameConfig } from '../utils/validators.js';

export default async function gameRoutes(fastify, options) {
  fastify.get('/', async () => {
    return StateManager.getActiveGames();
  });

  fastify.post('/', async (request, reply) => {
    const { name, totalPlayers, impostorCount, wordId } = request.body;
    const validation = validateGameConfig({ totalPlayers, impostorCount });
    if (!validation.valid) {
      return reply.status(400).send({ error: validation.error });
    }
    const game = StateManager.createGame({ name, totalPlayers, impostorCount, wordId });
    return game;
  });
}
