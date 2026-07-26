import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root is two levels up from server/src/
const PROJECT_ROOT = path.resolve(__dirname, '../..');

// Load .env from project root
dotenv.config({ path: path.join(PROJECT_ROOT, '.env') });

export const config = {
  PORT: parseInt(process.env.PORT, 10) || 3000,
  MENTOR_PIN: process.env.MENTOR_PIN || '87654321',
  DASHBOARD_PIN: process.env.DASHBOARD_PIN || '12344321',
  DB_PATH: process.env.DB_PATH
    ? path.resolve(PROJECT_ROOT, process.env.DB_PATH)
    : path.join(PROJECT_ROOT, 'data', 'impostor.db')
};
