# Resanda Portfolio CMS

Futuristic, responsive personal portfolio with a browser-based CMS prototype.

## Run locally

Open `index.html` in a browser, or use any static server. The Admin button opens the content workspace. Updates are stored in that browser's local storage.

## Production route

This MVP intentionally has no real authentication or database. For the PRD production release, migrate the data module to Supabase (Postgres + Storage) and protect `/admin` through Google OAuth restricted to the owner email. Keep server-side authorization checks on every write, validate HTTPS destinations, and serve only `Published` content to public routes.

## GitHub

The project is initialized as a local Git repository. Connect it to a GitHub repository after creating one in the desired account:

```bash
git remote add origin https://github.com/YOUR_USERNAME/resanda-portfolio-cms.git
git branch -M main
git push -u origin main
```
