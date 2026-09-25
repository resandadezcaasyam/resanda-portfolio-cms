# Resanda Portfolio CMS

Production-ready foundation for a futuristic personal portfolio and owner CMS.

## Stack

- Frontend: Next.js 15, React 19, TypeScript, responsive editorial-tech CSS.
- Backend: Next.js Route Handlers for validated API endpoints.
- Platform services: Supabase PostgreSQL, Auth (Google), and Storage.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Production setup

1. Create a Supabase project and run `supabase/schema.sql` in the SQL editor.
2. Configure Google OAuth in Supabase Auth, restrict login to `OWNER_EMAIL`, and add the values from `.env.example`.
3. Replace the seed content in `lib/content.ts` with Supabase read/write queries; retain the server-side status filters so Draft and Hidden items never reach public routes.
4. Deploy to Vercel. The included `npm run build` completes successfully.
