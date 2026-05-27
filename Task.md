# VedaAI – Full Stack Engineering Assignment

## Role
**Full Stack Engineer**

## Deadline
21 March (11:59 PM)

## Submission
- GitHub Repository + Deployed Link
- [Submit here](https://docs.google.com/forms/d/e/1FAIpQLSeL19GVvVT8vZrTx67hMWKTXLyJSyhkW5XGyzh7Ppt5w8P1jw/viewform?usp=dialog)

---

## Overview

Build an **AI Assessment Creator** based on the provided Figma designs.

The system should allow a teacher to:
- Create an assignment
- Generate a question paper using AI
- View the generated output

> **Extra points for creativity (Functionality)**

**Figma Design File:** [VedaAI – Hiring Assignment](https://www.figma.com/design/nB2HMm1BhTpmHcHrmEslGB/VedaAI---Hiring-Assignment?node-id=0-1&t=UjYQLgEek4u99AA4-1)

---

## Core Features

### 1. Assignment Creation (Frontend)

Build a form using the Figma designs with the following fields:
- File upload (PDF / text) *(optional)*
- Due date
- Question types
- Number of questions + marks
- Additional instructions

**Requirements:**
- Proper validation (no empty / negative values)
- Use **Redux** or **Zustand** for state management
- WebSocket management

---

### 2. AI Question Generation

**Requirements:**
- Convert form input → structured prompt
- Generate:
  - Sections (A, B, etc.)
  - Questions
  - Difficulty levels (Easy / Medium / Hard)
  - Marks per question

> ⚠️ Do **not** directly render the raw LLM response.

---

### 3. Backend System

**Stack:** Node.js + Express (TypeScript)

**Must include:**
| Technology | Purpose |
|---|---|
| MongoDB | Store assignments & results |
| Redis | Caching / job state |
| BullMQ | Background jobs (generation, PDF) |
| WebSocket | Real-time updates to frontend |

**Processing Flow:**
1. API receives request
2. Job added to BullMQ queue
3. Worker processes AI generation
4. Result stored in MongoDB
5. Frontend notified via WebSocket

---

### 4. Output Page (Enhanced)

Display the generated question paper in a structured, well-designed format inspired by the provided Figma UI.

#### Required Elements

**Student Info Section**
- Name *(input line)*
- Roll Number *(input line)*
- Section *(input line)*

**Question Sections**
- Group questions into sections (e.g., Section A, Section B, etc.)
- Each section must include:
  - Title
  - Instruction (e.g., *"Attempt all questions"*)
  - Questions list

**Each question must display:**
- Question text
- Difficulty tag (Easy / Moderate / Hard)
- Marks

#### UX Expectations
- Clean, readable layout (similar to a real exam paper)
- Proper spacing and visual hierarchy
- Mobile responsive

---

## Bonus Features *(Optional but High Signal)*

- [ ] **Download as PDF** — proper formatting, not raw HTML print
- [ ] **Action bar** — Regenerate button
- [ ] **Difficulty highlighting** — visual badges/tags per difficulty level
- [ ] **Better caching** — improved Redis caching strategy
- [ ] **Improved UI polish**

---

## What to Avoid

- Rendering raw AI/LLM response
- Poor formatting or misaligned sections
- Single block of text without hierarchy

---

## Tech Stack

### Frontend
- Next.js + TypeScript
- Redux / Zustand
- WebSocket

### Backend
- Node.js + Express (TypeScript)
- MongoDB
- Redis
- BullMQ

### AI
- Any LLM (GPT / Claude / Open Source)
- Prompt structuring + response parsing required

---

## Submission Requirements

### 1. GitHub Repository
- Clean, well-organized code
- Setup instructions in README

### 2. README Must Include
- Architecture overview
- Approach / design decisions

---

## Evaluation Criteria (Inferred)

| Area | What's Being Assessed |
|---|---|
| Frontend | Form UX, state management, WebSocket integration |
| Backend | Queue-based architecture, API design, real-time updates |
| AI Integration | Prompt engineering, structured output parsing |
| Output Page | Design fidelity, readability, responsiveness |
| Code Quality | TypeScript usage, clean structure, setup docs |
| Bonus | PDF export, creativity, UI polish |