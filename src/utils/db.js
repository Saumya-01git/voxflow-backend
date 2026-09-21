import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { neon } from '@neondatabase/serverless';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '../../storage/db.json');

let neonInitPromise = null;

/**
 * Ensures Neon PostgreSQL tables exist before queries execute
 */
function ensureNeonTables() {
  const databaseUrl = process.env.DATABASE_URL || '';
  if (!databaseUrl) return null;

  if (!neonInitPromise) {
    const sql = neon(databaseUrl);
    neonInitPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS speech_history (
          id VARCHAR(255) PRIMARY KEY,
          user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
          text TEXT NOT NULL,
          language VARCHAR(50) NOT NULL,
          voice VARCHAR(100) NOT NULL,
          audio_url TEXT NOT NULL,
          filename VARCHAR(255),
          duration INT DEFAULT 0,
          speed REAL DEFAULT 1.0,
          pitch REAL DEFAULT 0,
          is_favorite BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
      `;
      console.log('[Neon PostgreSQL] Database tables verified & initialized successfully.');
      return sql;
    })().catch((err) => {
      console.warn('[Neon PostgreSQL] Table initialization warning (fallback active):', err.message);
      neonInitPromise = null;
      return null;
    });
  }

  return neonInitPromise;
}

// Ensure local db.json exists with initial structure as fallback
function initLocalDB() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: [],
      history: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
  }
}

initLocalDB();

/**
 * Read data: Reads from Neon PostgreSQL if DATABASE_URL is set, otherwise from local JSON DB
 */
export async function readDB() {
  const databaseUrl = process.env.DATABASE_URL || '';
  if (databaseUrl) {
    try {
      const sql = await ensureNeonTables();
      if (sql) {
        const usersRows = await sql`SELECT id, name, email, password, created_at as "createdAt" FROM users`;
        const mappedUsers = (usersRows || []).map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          password: u.password,
          passwordHash: u.password,
          createdAt: u.createdAt
        }));
        const historyRows = await sql`
          SELECT 
            id, 
            user_id as "userId", 
            text, 
            language, 
            voice, 
            audio_url as "audioUrl", 
            filename, 
            duration, 
            speed, 
            pitch, 
            is_favorite as "isFavorite", 
            created_at as "createdAt" 
          FROM speech_history
          ORDER BY created_at DESC
        `;
        return {
          users: mappedUsers,
          history: historyRows || []
        };
      }
    } catch (neonErr) {
      console.warn('[Neon DB] Read failed, reading from local fallback:', neonErr.message);
    }
  }

  try {
    const raw = await fs.promises.readFile(DB_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.users)) {
      parsed.users = parsed.users.map((u) => ({
        ...u,
        passwordHash: u.passwordHash || u.password
      }));
    }
    return parsed;
  } catch {
    return { users: [], history: [] };
  }
}

/**
 * Write data: Syncs to Neon PostgreSQL if DATABASE_URL is set, and updates local file cache
 */
export async function writeDB(data) {
  // Always update local file as persistent safety backup
  try {
    await fs.promises.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.warn('Local DB write error:', err.message);
  }

  const databaseUrl = process.env.DATABASE_URL || '';
  if (databaseUrl && data) {
    try {
      const sql = await ensureNeonTables();
      if (sql) {
        // Sync Users
        if (Array.isArray(data.users)) {
          for (const user of data.users) {
            const passHash = user.passwordHash || user.password;
            await sql`
              INSERT INTO users (id, name, email, password, created_at)
              VALUES (${user.id}, ${user.name}, ${user.email}, ${passHash}, ${user.createdAt || new Date().toISOString()})
              ON CONFLICT (id) DO UPDATE 
              SET password = EXCLUDED.password, name = EXCLUDED.name;
            `;
          }
        }

        // Sync Speech History
        if (Array.isArray(data.history)) {
          for (const h of data.history) {
            await sql`
              INSERT INTO speech_history (id, user_id, text, language, voice, audio_url, filename, duration, speed, pitch, is_favorite, created_at)
              VALUES (${h.id}, ${h.userId}, ${h.text}, ${h.language}, ${h.voice}, ${h.audioUrl}, ${h.filename || ''}, ${h.duration || 0}, ${h.speed || 1.0}, ${h.pitch || 0}, ${Boolean(h.isFavorite)}, ${h.createdAt || new Date().toISOString()})
              ON CONFLICT (id) DO UPDATE 
              SET is_favorite = EXCLUDED.is_favorite;
            `;
          }
        }
      }
    } catch (neonErr) {
      console.warn('[Neon DB] Write sync warning:', neonErr.message);
    }
  }
}
