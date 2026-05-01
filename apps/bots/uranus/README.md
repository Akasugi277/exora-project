# Uranus Bot (Rust)

Uranus is the Rust implementation of the shared Exora bot specification.

## Stack

| Item              | Value                 |
| ----------------- | --------------------- |
| Language          | Rust (stable)         |
| Discord framework | Serenity 0.12         |
| TLS backend       | rustls                |
| DB client         | sqlx 0.7 (PostgreSQL) |
| Cache client      | redis 0.25            |
| Base image        | rust:1-slim-bookworm  |

## Implemented features

- `/ping` — replies with latency and writes event to Galileo DB
- `/info` — shows bot version and uptime
- PostgreSQL heartbeat (updates `bot_instances` every 30 s)
- Async DB / Redis connectivity check on startup

## Required environment variables

| Variable               | Description                             |
| ---------------------- | --------------------------------------- |
| `DISCORD_TOKEN_URANUS` | Bot token from Discord Developer Portal |
| `DATABASE_URL`         | PostgreSQL connection URI               |
| `REDIS_URL`            | Redis connection URI                    |

## Local build

```bash
cargo build --release
cargo run
```

## Docker build

```bash
docker build -t uranus .
```

---

# Uranus Bot（日本語）

Uranus は Exora BOT 仕様の Rust 実装です。

## スタック

- Rust / Serenity 0.12
- rustls（TLS）・sqlx 0.7（PostgreSQL）・redis 0.25
- Docker ベースイメージ: rust:1-slim-bookworm

## 実装済み機能

- `/ping` — レイテンシを返信・DB にイベント記録
- `/info` — BOT 情報を返信
- 起動時に DB/Redis 接続確認

## 環境変数

| 変数名                 | 説明                                     |
| ---------------------- | ---------------------------------------- |
| `DISCORD_TOKEN_URANUS` | Discord Developer Portal の BOT トークン |
| `DATABASE_URL`         | PostgreSQL 接続 URI                      |
| `REDIS_URL`            | Redis 接続 URI                           |
