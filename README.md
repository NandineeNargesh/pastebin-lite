# Pastebin-Lite ☕

#live link : https://pastebin-lite-catygox9d-nandinee-nargeshs-projects.vercel.app

A minimalist, self-destructing note-sharing application built with Next.js and Prisma.

## Persistence Layer
I used **Neon (PostgreSQL)** for the persistence layer. I chose Postgres because it allows for atomic increments of view counts, ensuring that "max view" constraints are strictly enforced even under concurrent load.

## How to Run Locally
1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up your `.env` file with a `DATABASE_URL` (Postgres).
4. Sync the database: `npx prisma db push`
5. Run the development server: `npm run dev`
6. Open `http://localhost:3000`

## Design Decisions
- **Prisma Transactions:** Used to ensure that checking constraints and incrementing view counts happen in a single atomic operation.
- **Deterministic Time:** Implemented a utility to check for `TEST_MODE=1` and the `x-test-now-ms` header to support automated testing of expired pastes.
- **Security:** Content is rendered using React's default escaping to prevent XSS (No script execution).
