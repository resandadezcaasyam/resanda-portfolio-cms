# Resanda Portfolio

A Next.js portfolio with one persistent React Three Fiber environment, scroll-directed GSAP storytelling and a conventional content editor.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:3000. For production locally, use `npm run build` then `npm run start`.

## Content

- `/admin`: projects, experiences and profile.
- `/admin/world`: expertise, achievements, introduction, leadership, impact and external links.
- Local CMS edits persist in ignored JSON files under `data/`.
- Supabase deployments need `supabase/schema.sql` and `supabase/world-config.sql`, plus the environment values listed in `.env.example`.
- GitHub is optional and is not shown until a verified URL is configured. The supplied original CV is served at `/documents/resanda-resume.pdf`; `/resume` provides an accessible HTML version.

The admin/API access model is inherited from the existing app: owner authentication must be implemented before exposing mutation endpoints on a public deployment. Supabase configuration is supported but was not exercised against a live remote database in this local rebuild.

## Architecture and checks

See `MOTION-ARCHITECTURE.md` for scene design, route preservation, fallback behavior and performance choices.

```sh
npm run build
node scripts/audit-world.cjs
node scripts/verify-world-behavior.cjs
```

Browser checks require the server on port 3000 and Playwright Chromium.
