import { WordModel } from '../models/word.model.js';

export default async function wordRoutes(fastify, options) {
  fastify.get('/', async () => {
    return WordModel.getAll();
  });

  fastify.get('/:id', async (request, reply) => {
    const word = WordModel.getById(request.params.id);
    if (!word) return reply.status(404).send({ error: 'Word not found' });
    return word;
  });

  fastify.post('/', async (request) => {
    const { keyword, hint } = request.body;
    return WordModel.create({ keyword, hint });
  });

  fastify.put('/:id', async (request) => {
    const { keyword, hint } = request.body;
    return WordModel.update(request.params.id, { keyword, hint });
  });

  fastify.delete('/:id', async (request) => {
    WordModel.remove(request.params.id);
    return { success: true };
  });
}
