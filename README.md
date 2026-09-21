# VoxFlow — Backend API Server ⚡🎧

[![API Status](https://img.shields.io/badge/API%20Status-Live-success?style=for-the-badge&logo=render)](https://voxflow-backend.onrender.com/api/health)
[![Live Frontend](https://img.shields.io/badge/Web%20App-Vercel-informational?style=for-the-badge&logo=vercel)](https://voxflow-frontend-eight.vercel.app/)
[![Database](https://img.shields.io/badge/Database-Neon%20PostgreSQL-blueviolet?style=for-the-badge&logo=postgresql)](https://neon.tech)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **VoxFlow Backend** is a high-performance, production-ready Node.js & Express REST API server providing multi-language Text-to-Speech synthesis, neural voice management, secure user authentication, and persistent cloud storage backed by **Neon Serverless PostgreSQL**.

---

## 🔗 Quick Links

- ⚡ **Live Backend API**: [https://voxflow-backend.onrender.com](https://voxflow-backend.onrender.com)
- 🌐 **Live Frontend Client**: [https://voxflow-frontend-eight.vercel.app/](https://voxflow-frontend-eight.vercel.app/)
- 💻 **Backend Repository**: [https://github.com/Saumya-01git/voxflow-backend](https://github.com/Saumya-01git/voxflow-backend)
- 💻 **Frontend Repository**: [https://github.com/Saumya-01git/voxflow-frontend](https://github.com/Saumya-01git/voxflow-frontend)

---

## 📸 Visual Showcase & App Preview

### 1. Speech Studio — Light Theme (Morning Fairytale)
![VoxFlow Speech Studio Light Theme](./screenshots/light_mode_studio.png)

### 2. Speech Studio — Dark Theme (Cybernetic Oceanic)
![VoxFlow Speech Studio Dark Theme](./screenshots/dark_mode_studio.png)

### 3. Fairy Tale Realm & Story Deck (with Translucent Soundwave Art)
![VoxFlow Fairy Tale Realm Dark Theme](./screenshots/dark_mode_fairytale.png)

---

## 🏗️ Architecture & Database Design

The backend uses a modular MVC architecture (Routes &rarr; Controllers &rarr; Services &rarr; Database Adapter).

### Neon PostgreSQL Database Schema
Tables are provisioned automatically upon initial boot if `DATABASE_URL` is set:

```sql
-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Speech History Table
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
```

---

## 📡 API Endpoints

### 1. System Health
- **`GET /api/health`**: Returns uptime, status, and service health metadata.

### 2. Voice Metadata
- **`GET /api/voices`**: Returns the list of 17+ neural voices with language codes, genders, and locale descriptors.

### 3. Speech Synthesis
- **`POST /api/tts`**: Converts submitted text into an MP3 audio file.
  - **Body**: `{ text, language, voice, speed, pitch }`
  - **Response**: `{ success: true, audioUrl, duration, format, characterCount }`

### 4. Authentication
- **`POST /api/auth/register`**: Creates a new user account with bcrypt password hashing and returns JWT token.
- **`POST /api/auth/login`**: Authenticates credentials and returns JWT bearer token.
- **`GET /api/auth/me`**: Returns the profile information of the authenticated user.
- **`PUT /api/auth/update-password`**: Allows authenticated users to securely change their password directly.

### 5. Personalized Audio History
- **`GET /api/user/history`**: Returns the authenticated user's synthesis records.
- **`PATCH /api/user/history/:id/favorite`**: Toggles favorite status on a history item.
- **`DELETE /api/user/history/:id`**: Permanently removes a record from the database.

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_super_secret_jwt_key_here
DATABASE_URL=postgresql://neondb_owner:password@ep-xyz.neon.tech/neondb?sslmode=require
```

---

## 🚀 Local Setup

```bash
git clone https://github.com/Saumya-01git/voxflow-backend.git
cd voxflow-backend
npm install
npm run dev
```

---

## 📄 License
This project is licensed under the MIT License.
