# Frontend Application

Vue.js 3 application with Composition API and TypeScript.

## Setup

See the root [README](../../README.md) for full setup and `VITE_API_URL` in `.env`.

## Project Structure

```
src/
├── components/      # Reusable components (common, tasks, analytics)
├── views/           # Page components
├── stores/          # Pinia stores (auth, task, analytics)
├── services/        # API clients
├── router/          # Vue Router
├── types/           # TypeScript types
├── composables/     # useToast, etc.
├── assets/          # Styles
└── main.ts
```

## Scripts

- `npm run dev` – Vite dev server (port 5173)
- `npm run build` – Production build
- `npm run preview` – Preview production build
- `npm test` – Vitest
