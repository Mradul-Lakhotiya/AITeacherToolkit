# VedaAI

VedaAI is an AI-powered platform for teachers to generate customized assignments and question papers instantly. The platform is designed with a premium, mobile-first UI and utilizes advanced AI models to generate high-quality educational content.

## Project Structure

This repository is organized as a monorepo with two main directories:

- `/frontend`: A Next.js application providing a responsive and modern user interface.
- `/backend`: A Node.js/Express server that handles API requests, database operations, and AI integration.

## Getting Started

To run the full stack application locally, you will need to start both the frontend and backend servers.

### 1. Start the Backend
Navigate to the `backend` directory, install dependencies, and start the development server.
```bash
cd backend
npm install
npm run dev
```
Make sure to configure the `.env` file in the backend directory with your `MONGO_URI` and `GEMINI_API_KEY`.

### 2. Start the Frontend
In a new terminal window, navigate to the `frontend` directory, install dependencies, and start the Next.js development server.
```bash
cd frontend
npm install
npm run dev
```

For more specific details, please refer to the `README.md` files located in the `frontend` and `backend` directories.
