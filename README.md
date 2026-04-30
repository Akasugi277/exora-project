# Exora Project

Exora Project is a monorepo for a four-bot Discord system with a shared data core (Galileo).

## Architecture

- Jupiter: Java + Discord4J
- Saturn: TypeScript
- Uranus: Rust
- Neptune: Haskell
- Galileo DB: PostgreSQL
- Sync cache: Redis
- Dashboard: Next.js + TypeScript

## Repository layout

```text
exora-project/
├── apps/
│   ├── bots/
│   │   ├── jupiter/
│   │   ├── saturn/
│   │   ├── uranus/
│   │   └── neptune/
│   └── dashboard/
│       └── web-ui/
├── data/
│   ├── galileo-db/
│   │   └── migrations/
│   └── redis/
├── docs/
├── shared/
│   ├── assets/
│   └── proto/
├── .env.example
├── .gitignore
└── docker-compose.yml
```

## Quick start

1. Copy `.env.example` to `.env`.
2. Start base infrastructure:

```bash
docker compose up -d postgres redis
```

3. Stop infrastructure:

```bash
docker compose down
```

## Security rules

- Never commit `.env`.
- Keep all secrets in environment variables.
- Rotate bot tokens regularly.

## Current phase

This commit initializes the monorepo structure and baseline infrastructure only.
Service implementation for each bot and dashboard is scaffolded separately.
