import { API_BASE } from '../utils/constants';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const fetchJson = async (endpoint, options = {}) => {
  const headers = { ...options.headers };
  
  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  
  const data = await res.json().catch(() => ({}));
  
  if (!res.ok) {
    throw new ApiError(data.error || 'Erro na requisição', res.status);
  }
  return data;
};

export const api = {
  verifyPin: (pin, type) => 
    fetchJson('/auth/verify-pin', { method: 'POST', body: JSON.stringify({ pin, type }) }),
  
  getWords: () => fetchJson('/words'),
  
  createWord: (data) => 
    fetchJson('/words', { method: 'POST', body: JSON.stringify(data) }),
    
  updateWord: (id, data) => 
    fetchJson(`/words/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    
  deleteWord: (id) => 
    fetchJson(`/words/${id}`, { method: 'DELETE' }),
    
  createGame: (data) => 
    fetchJson('/games', { method: 'POST', body: JSON.stringify(data) }),
};
