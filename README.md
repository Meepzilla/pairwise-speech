# PairWise Speech

Generate minimal, maximal, cycles, complexity, and multiple opposition target pairs for speech therapy, from entered phonological errors.

Source code exported from Firebase Studio on 2026-11-07 as a backup. The Firebase App Hosting config and the local .env file were removed, and this repo contains no secrets and no Firebase project config.

## Run locally

Run npm install and npm run dev. No API key or secret is needed. The AI target generator has been removed and target generation is turned off in the UI.

## Cloudflare hosting

This is a Next.js app, so it deploys to Cloudflare Workers, not as a static site. The OpenNext Cloudflare adapter is installed. Run npm run deploy to build and deploy to Cloudflare Workers, or npm run preview to test the Worker locally. No API key or secret is needed.
