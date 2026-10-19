# Chinmaya Vidyalaya

## Deploy to Vercel

The Git repository root contains `package.json`, `index.html` and `vercel.json`.
Use these Vercel project settings:

- Root Directory: `./` (repository root).
- Framework Preset: Vite.
- Build Command: `npm run build`.
- Output Directory: `dist`.

`vercel.json` supplies the build settings and routes direct page requests back
to `index.html` so the React application can render `/incampus`, `/academics`,
`/campus-life`, `/achievements` and legacy About links. Existing static assets
are served normally.

Commit and push configuration changes, then deploy the new commit. If even `/`
returns Vercel's `NOT_FOUND`, check that the production domain points to a Ready
deployment for the correct project and that the deployed commit includes these
files. A rewrite does not repair a removed deployment or an incorrect domain.

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
