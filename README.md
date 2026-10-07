# Chiro Discord Bot Monorepo

Welcome to the Chiro Discord Bot monorepo. This project houses the Discord bot application, a Next.js web dashboard, and shared packages using Turborepo and npm workspaces.

## Features
- **Discord Bot**: Powered by `discord.js`.
- **Web Dashboard**: Built with Next.js 14, TailwindCSS, and NextAuth.js.
- **Database**: PostgreSQL with Prisma ORM (or preferred DB tool).
- **Caching**: Redis for efficient caching and rate limiting.
- **Monorepo**: Turborepo for ultra-fast builds.

## Prerequisites
- Node.js 20+
- PostgreSQL 16+
- Redis 7+
- Docker (optional, for containerized deployments)

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd chiro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

4. **Database Migrations**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Start Development Servers**
   ```bash
   npm run dev
   ```
   This will start both the Discord bot and the Next.js dashboard concurrently.

## Discord Application Setup
1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new Application
3. Copy the `Client ID` and `Client Secret` into your `.env` file
4. In the "Bot" tab, generate a token and copy it to `DISCORD_TOKEN` in your `.env` file
5. Enable all Privileged Gateway Intents (Presence, Server Members, Message Content)
6. Add your OAuth2 redirect URI: `http://localhost:3000/api/auth/callback/discord`

## Register Slash Commands
Whenever you create or modify a slash command, run:
```bash
npm run deploy-commands --workspace=apps/bot
```

## Docker Deployment
To spin up the entire stack (Postgres, Redis, Bot, and Dashboard) via Docker Compose:
```bash
docker-compose up -d --build
```

## Render Deployment
1. Connect your repository to Render.
2. In the Render Dashboard, go to "Blueprints" -> "New Blueprint Instance".
3. Select your repository.
4. Render will automatically provision the PostgreSQL database, Redis instance, Web Service (Dashboard), and Background Worker (Bot) according to `render.yaml`.
5. You must manually add your Discord secrets (DISCORD_TOKEN, etc.) in the Render dashboard for each service, as they are marked `sync: false`.

## Architecture Overview
- `apps/bot`: Discord bot application.
- `apps/dashboard`: Next.js admin dashboard and user portal.
- `packages/database`: Shared database schema and clients.
- `packages/shared`: Shared types and utilities.
- `packages/config`: Shared configuration (ESLint, TSConfig).

## Contributing
Please see `CONTRIBUTING.md` (if available) or simply follow standard Pull Request workflows. Ensure `npm run type-check` and `npm run lint` pass before submitting.
