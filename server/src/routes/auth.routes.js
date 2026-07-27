import { config } from '../config.js';

export default async function authRoutes(fastify, options) {
  fastify.post('/verify-pin', async (request, reply) => {
    const { pin } = request.body;
    
    if (config.MENTOR_PIN === config.DASHBOARD_PIN) {
      return reply.status(500).send({ error: 'Erro de configuração: Os PINs não podem ser iguais.' });
    }

    if (pin === config.MENTOR_PIN) {
      return { valid: true, type: 'mentor' };
    } else if (pin === config.DASHBOARD_PIN) {
      return { valid: true, type: 'dashboard' };
    }

    return { valid: false };
  });
}
