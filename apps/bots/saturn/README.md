# Saturn Bot (TypeScript)

Saturn is the TypeScript implementation of the shared Exora bot specification.

## Stack

| Item              | Value              |
| ----------------- | ------------------ |
| Language          | TypeScript         |
| Discord framework | discord.js v14     |
| Runtime           | Node.js 20-alpine  |
| DB client         | pg (node-postgres) |
| Cache client      | ioredis            |

## Implemented features

- `/ping` — replies with latency and writes event to Galileo DB
- `/info` — shows bot version and uptime
- PostgreSQL heartbeat (updates `bot_instances` every 30 s)
- Redis status check on startup

## Required environment variables

| Variable               | Description                             |
| ---------------------- | --------------------------------------- |
| `DISCORD_TOKEN_SATURN` | Bot token from Discord Developer Portal |
| `DATABASE_URL`         | PostgreSQL connection URI               |
| `REDIS_URL`            | Redis connection URI                    |

## Local development

```bash
npm install
npm run dev      # ts-node watch mode
npm run build    # compile to dist/
npm start        # run compiled JS
```

## Docker build

```bash
docker build -t saturn .
```

---

# Saturn Bot（日本語）

Saturn は Exora BOT 仕様の TypeScript 実装です。

## スタック

- TypeScript / discord.js v14
- Node.js 20-alpine
- node-postgres・ioredis

## 実装済み機能

- `/ping` — レイテンシを返信・DB にイベント記録
- `/info` — BOT 情報を返信
- PostgreSQL ハートビート（30秒周期）

## 環境変数

| 変数名                 | 説明                                     |
| ---------------------- | ---------------------------------------- |
| `DISCORD_TOKEN_SATURN` | Discord Developer Portal の BOT トークン |
| `DATABASE_URL`         | PostgreSQL 接続 URI                      |
| `REDIS_URL`            | Redis 接続 URI                           |
