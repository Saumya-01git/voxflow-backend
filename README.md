# VoxFlow — Backend API Server ⚡🎧

> **VoxFlow Backend** is a modular, production-ready Node.js & Express REST API server providing high-quality multi-language Text-to-Speech synthesis, audio file delivery, and voice metadata management.

---

## 📌 Project Overview
- **Project Name**: VoxFlow (Server)
- **Tech Stack**: Node.js, Express.js, Edge-TTS / Google-TTS Engine, CORS, Dotenv
- **Architecture**: MVC (Model-View-Controller / Routes-Controllers-Services)
- **Timeline**: 14-Day Structured Enterprise Development Plan

---

## 🎯 Day 1: Backend Architecture & API Contracts

### 1. API Endpoints Specification

#### A. Health Check
- **Endpoint**: `GET /api/health`
- **Description**: Verifies server uptime and service status.
- **Response**:
```json
{
  "status": "healthy",
  "service": "VoxFlow TTS Engine",
  "timestamp": "2026-09-08T14:45:00.000Z"
}
```

#### B. Fetch Available Voices
- **Endpoint**: `GET /api/voices`
- **Description**: Returns all supported languages and their corresponding neural voices.
- **Response**:
```json
{
  "success": true,
  "voices": [
    { "name": "Jenny (Neural)", "code": "en-US-JennyNeural", "language": "en-US", "gender": "Female" },
    { "name": "Guy (Neural)", "code": "en-US-GuyNeural", "language": "en-US", "gender": "Male" },
    { "name": "Swara (Neural)", "code": "hi-IN-SwaraNeural", "language": "hi-IN", "gender": "Female" },
    { "name": "Madhur (Neural)", "code": "hi-IN-MadhurNeural", "language": "hi-IN", "gender": "Male" },
    { "name": "Dhwani (Neural)", "code": "gu-IN-DhwaniNeural", "language": "gu-IN", "gender": "Female" },
    { "name": "Aarohi (Neural)", "code": "mr-IN-AarohiNeural", "language": "mr-IN", "gender": "Female" },
    { "name": "Elvira (Neural)", "code": "es-ES-ElviraNeural", "language": "es-ES", "gender": "Female" },
    { "name": "Denise (Neural)", "code": "fr-FR-DeniseNeural", "language": "fr-FR", "gender": "Female" },
    { "name": "Katja (Neural)", "code": "de-DE-KatjaNeural", "language": "de-DE", "gender": "Female" }
  ]
}
```

#### C. Synthesize Speech
- **Endpoint**: `POST /api/tts`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "text": "Hello, welcome to VoxFlow Text-to-Speech.",
  "language": "en-US",
  "voice": "en-US-JennyNeural",
  "speed": 1.0,
  "pitch": 0.0
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "audioUrl": "/audio/voxflow_1694200000000.mp3",
  "duration": 2.8,
  "format": "mp3",
  "characterCount": 42
}
```
- **Error Response (400 Bad Request)**:
```json
{
  "success": false,
  "error": "Text is required and must not exceed 2000 characters."
}
```

---

## 📅 14-Day Development Roadmap

| Day | Milestone | Status |
|---|---|---|
| **Day 1** | Requirements analysis, API contract definitions, and architecture design | Completed |
| **Day 8** | Initialize Express backend project with modular MVC structure & configs | Pending |
| **Day 9** | Create `/api/tts` and `/api/voices` routes with validation middleware | Pending |
| **Day 10** | Integrate multi-language Text-to-Speech provider | Pending |
| **Day 11** | Audio generation pipeline, audio caching, and static audio streaming | Pending |
| **Day 14** | Rate limiting, error handling hardening, Postman collection & test suite | Pending |
