# VedaAI Frontend

This is the frontend application for VedaAI, built with Next.js and React. It provides a premium, responsive user interface tailored for educators.

## Technologies Used

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Custom inline SVGs & styled components
- **Routing**: Next.js file-based routing

## Key Features

- **Mobile-First Premium UI**: High-end glassmorphism, smooth animations, and tailored responsive designs matching Figma specifications.
- **Authentication**: JWT-based session management and simple login flows.
- **Assignment Creation**: A multi-step intuitive form to configure AI generation parameters (Question types, difficulty, marking).
- **Printable Output**: A specialized layout for printing generated assignments that resembles an authentic examination paper.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables
Create a `.env.local` file in the root of the frontend directory (you can copy `.env.example` as a starting point):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```
