import { config } from '../config.js';

export default async function authRoutes(fastify, options) {
  fastify.post('/verify-pin', async (request, reply) => {
    const { pin, type } = request.body;
    let valid = false;
    
    if (type === 'mentor' && pin === config.MENTOR_PIN) valid = true;
    else if (type === 'dashboard' && pin === config.DASHBOARD_PIN) valid = true;

    return { valid };
  });
}
