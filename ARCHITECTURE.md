# VoxFlow Backend Architecture & Security Specification 🛡️

## 1. Directory Structure
```
backend/
├── src/
│   ├── controllers/
│   │   ├── ttsController.js
│   │   └── voiceController.js
│   ├── routes/
│   │   ├── ttsRoutes.js
│   │   ├── voiceRoutes.js
│   │   └── healthRoutes.js
│   ├── services/
│   │   └── ttsService.js
│   ├── middleware/
│   │   ├── validator.js
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── utils/
│   │   ├── logger.js
│   │   └── responseFormatter.js
│   └── server.js
├── storage/
│   └── audio/
├── postman/
│   └── TTS_API_Collection.json
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 2. HTTP Status Code Mapping (Document Section 14)
- `200 OK`: Successful synthesis / voice retrieval.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Validation failure (empty text, invalid voice, invalid JSON).
- `401 Unauthorized`: Missing or invalid API key (if secured).
- `404 Not Found`: Route or audio resource not found.
- `429 Too Many Requests`: Rate limit exceeded.
- `500 Internal Server Error`: TTS provider or synthesis runtime failure.
- `503 Service Unavailable`: TTS provider upstream unavailable.

## 3. Security Hardening (Document Section 15)
- **CORS Config**: Strictly allowed origins (configured via `CLIENT_URL`).
- **Rate Limiting**: Prevent abuse of TTS generation endpoints.
- **Input Sanitization**: Trim input, enforce length bounds (max 2000 characters).
- **Environment Isolation**: API secrets never checked into version control.
