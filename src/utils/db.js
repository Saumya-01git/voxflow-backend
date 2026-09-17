import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '../../storage/db.json');

// Ensure db.json exists with initial structure
function initDB() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: [],
      history: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
  }
}

initDB();

/**
 * Read all data from JSON DB
 */
export async function readDB() {
  try {
    const raw = await fs.promises.readFile(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { users: [], history: [] };
  }
}

/**
 * Write updated data to JSON DB
 */
export async function writeDB(data) {
  await fs.promises.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}
