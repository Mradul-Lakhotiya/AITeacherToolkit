# VedaAI Backend

This is the backend API service for VedaAI, providing RESTful endpoints for the frontend application. It manages authentication, assignment generation via AI, and database storage.

## Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ORM)
- **AI Integration**: Google Generative AI (Gemini)
- **Background Jobs**: BullMQ and Redis for processing AI generation asynchronously.
- **Authentication**: Simplified MVP session state (no JWT used currently)
- **CORS & Middleware**: Express middleware stack

## Key Features

- **Auth System**: Basic login/signup system storing user credentials for MVP purposes.
- **Assignment Generation**: Uses Gemini AI (`gemini-1.5-flash`) to generate structured JSON representing an assignment with sections, questions (with difficulty levels and marks), and an answer key.
- **Database Storage**: Stores all generated assignments for future retrieval and dashboard listing.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root of the backend directory (you can copy `.env.example` as a starting point) and configure the following variables:
```env
PORT=4000
MONGO_URI="mongodb+srv://<username>:<password>@cluster0.fo1mrfs.mongodb.net/?appName=Cluster0"
UPSTASH_REDIS_REST_URL="https://your_redis_url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_redis_rest_token"
REDIS_URL="rediss://default:your_redis_token@your_redis_url.upstash.io:6379"
GEMINI_API_KEY="your_gemini_api_key"
```

3. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:4000`.

## API Endpoints Overview

- `POST /api/auth/login` - Authenticate a user.
- `POST /api/assignments` - Generate and save a new assignment using AI.
- `GET /api/assignments` - Retrieve a list of all saved assignments for the user.
- `GET /api/assignments/:id` - Retrieve a specific assignment by ID.
