import { WordModel } from '../models/word.model.js';

export default async function wordRoutes(fastify, options) {
  fastify.get('/', async () => {
    return WordModel.getAll();
  });

  fastify.get('/:id', async (request, reply) => {
    const id = Number(request.params.id);
    const word = WordModel.getById(id);
    if (!word) return reply.status(404).send({ error: 'Word not found' });
    return word;
  });

  fastify.post('/', async (request) => {
    const { keyword, hint } = request.body;
    return WordModel.create({ keyword, hint });
  });

  fastify.put('/:id', async (request) => {
    const id = Number(request.params.id);
    const { keyword, hint } = request.body;
    return WordModel.update(id, { keyword, hint });
  });

  fastify.delete('/:id', async (request, reply) => {
    try {
      const id = Number(request.params.id);
      WordModel.remove(id);
      return { success: true };
    } catch (err) {
      return reply.status(400).send({ error: 'Erro ao excluir a palavra. Ela pode estar em uso.', details: err.message });
    }
  });
}
