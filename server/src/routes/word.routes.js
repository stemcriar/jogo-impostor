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
    const id = parseInt(request.params.id, 10);
    if (isNaN(id)) {
      return reply.status(400).send({ error: 'ID inválido' });
    }
    
    try {
      WordModel.remove(id);
      return { success: true };
    } catch (error) {
      return reply.status(409).send({ error: 'Esta palavra está vinculada a um jogo e não pode ser excluída.' });
    }
  });
}
