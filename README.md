# Rendi Frontend

A **Next.js 14** frontend for a home-buying readiness application. Rendi helps first-time buyers understand how close they are to affording a property by calculating a readiness score, timeline estimate, and recommended next steps.

## What it includes

- Public landing page with product messaging and CTA
- Register and login flows with client-side validation
- Protected dashboard area for authenticated users
- Latest assessment summary, history, profile management, and results pages
- API integration with a backend via Axios
- Token-based authentication with refresh handling
- Responsive dashboard layout with desktop sidebar and mobile navigation

## Key technologies

- `next` 14.2.3
- `react` 18
- `typescript` 5
- `tailwindcss` 3.4.1
- `zustand` for client auth state
- `axios` for HTTP requests
- `react-hook-form` + `zod` for form validation
- `lucide-react` icons
- `@radix-ui` primitives for UI patterns
- `next/font/google` for typography

## Important project structure

- `src/app/` — Next.js app router pages and layout
- `src/components/` — reusable UI and layout components
- `src/hooks/` — auth store and client state logic
- `src/lib/api.ts` — Axios instance, auth/assessment API wrappers, token refresh logic
- `src/lib/utils.ts` — formatters, class helpers, API error extraction
- `src/types/` — typed payloads and API response shapes
- `src/middleware.ts` — protects `/dashboard` routes using cookie-based auth

## Available routes

- `/` — public landing page
- `/auth/register` — signup page
- `/auth/login` — signin page
- `/dashboard` — authenticated home/dashboard page
- `/dashboard/assessment` — new readiness assessment page
- `/dashboard/history` — assessment history page
- `/dashboard/profile` — user profile page
- `/dashboard/result` — assessment result page

## Setup

1. Install dependencies

```bash
npm install
```

2. Start the development server

```bash
npm run dev
```

3. Open the app

```text
http://localhost:3000
```

## Environment variables

This frontend expects a backend API base URL. By default it falls back to:

```text
http://localhost:8000
```

You can override it with:

```bash
NEXT_PUBLIC_API_URL=https://your-api.example.com
```

## Notes

- Auth uses `localStorage` and cookie synchronization for both client-side protection and Next.js middleware route guarding.
- The frontend currently assumes a Django-style or REST API with endpoints such as:
  - `/api/auth/register/`
  - `/api/auth/login/`
  - `/api/auth/profile/`
  - `/api/auth/change-password/`
  - `/api/assessments/submit/`
  - `/api/assessments/latest/`
  - `/api/assessments/history/`
  - `/api/assessments/{id}/`
- `npm run lint` is available for ESLint checks.

## Scripts

- `npm run dev` — run Next.js in development mode
- `npm run build` — build the production app
- `npm run start` — start the production server
- `npm run lint` — run Next.js linting

## Recommended next steps

- Add a backend or mock API if not already present
- Implement missing dashboard pages if any are incomplete
- Add unit or integration tests for auth and assessment flows
- Document expected backend contract and API response shapes
