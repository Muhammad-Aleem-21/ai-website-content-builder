# SiteCopy AI — AI Website Content Builder

A responsive Next.js web application for generating, editing, regenerating, saving, and previewing complete website copy using AI and MongoDB Atlas.

## Features

- **Business Input Form**: Enter business name, industry, services, target audience, and business description.
- **Website Type & Tone Selection**: Choose from `Agency`, `E-commerce`, `Portfolio`, `Restaurant`, or `SaaS`, and tones `Professional`, `Creative`, `Friendly`, or `Minimal`.
- **AI Content Generation**: Uses Groq SDK (`openai/gpt-oss-120b`) with Zod schema validation to generate structured JSON for:
  - Hero Section (3 headline variations, 3 description variations, and CTA options)
  - About Us (multiple story variations)
  - Services
  - Features
  - Why Choose Us
  - Testimonials (placeholders)
  - FAQs
- **Edit, Regenerate, Copy & Save**: Inline editing of any generated text, per-section regeneration with optional custom instructions, one-click section copy, and saving to MongoDB.
- **Authentication & Project Dashboard**: JWT-based `httpOnly` cookie authentication (`/signup`, `/login`, `/api/auth/*`) with `bcryptjs` password hashing, MongoDB Atlas persistence via Mongoose, and a `/dashboard` project history view.
- **Responsive Site Preview**: Dedicated `/preview/[id]` route rendering all selected and edited sections in a clean, responsive website layout.

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, Tailwind CSS v4
- **AI**: `groq-sdk` with `zod` schema validation
- **Database**: MongoDB Atlas with `mongoose`
- **Auth**: `jose` (HS256 JWT in `httpOnly` cookies) + `bcryptjs`

## Getting Started

1. Install dependencies:
   ```bash
   cd web
   npm install
   ```

2. Configure environment variables in `web/.env.local`:
   ```env
   GROQ_API_KEY=your_groq_api_key
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_random_secret_string
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

4. Build for production:
   ```bash
   npm run build
   npm start
   ```

## Project Structure

- `web/app/` — App Router pages (`/`, `/builder`, `/dashboard`, `/login`, `/signup`, `/preview/[id]`) and API routes (`/api/auth/*`, `/api/generate`, `/api/regenerate`, `/api/projects/*`)
- `web/components/` — `Navbar`, `AuthForm`, `SitePreview`, and shared UI components
- `web/lib/` — MongoDB connection (`db.js`), JWT session helpers (`auth.js`), and AI prompt/schema/generation (`lib/ai/`)
- `web/models/` — Mongoose `User` and `Project` models
