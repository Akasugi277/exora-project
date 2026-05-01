# Neptune Bot (Haskell)

Neptune is the Haskell implementation of the shared Exora bot specification.

## Stack

| Item            | Value                  |
| --------------- | ---------------------- |
| Language        | Haskell (GHC 9.6.4)    |
| Discord library | discord-haskell 1.18.0 |
| Build tool      | Stack (LTS-22.15)      |
| Base image      | haskell:9.6            |

## Implemented features

- `/ping` — replies with latency and writes event to Galileo DB
- `/info` — shows bot version and uptime
- PostgreSQL heartbeat (updates `bot_instances` every 30 s)
- Slash command registration on `Ready` event using `partialApplicationID`

## Required environment variables

| Variable                | Description                             |
| ----------------------- | --------------------------------------- |
| `DISCORD_TOKEN_NEPTUNE` | Bot token from Discord Developer Portal |
| `DATABASE_URL`          | PostgreSQL connection URI               |
| `REDIS_URL`             | Redis connection URI                    |

## Local build

```bash
stack build
stack exec neptune
```

## Docker build

> Note: The first build takes a long time (GHC compilation). Subsequent builds use cached layers.

```bash
docker build -t neptune .
```

## Key implementation notes

- Language extensions required: `OverloadedStrings`, `ScopedTypeVariables`
- Slash command registration uses `createChatInput "name" "desc"` helper
- `InteractionApplicationCommand { applicationCommandData = cmdData }` pattern match for handling interactions

---

# Neptune Bot（日本語）

Neptune は Exora BOT 仕様の Haskell 実装です。

## スタック

- Haskell GHC 9.6.4 / discord-haskell 1.18.0
- Stack (LTS-22.15)
- Docker ベースイメージ: haskell:9.6

## 実装済み機能

- `/ping` — レイテンシを返信・DB にイベント記録
- `/info` — BOT 情報を返信
- `Ready` イベント時にスラッシュコマンド自動登録

## 環境変数

| 変数名                  | 説明                                     |
| ----------------------- | ---------------------------------------- |
| `DISCORD_TOKEN_NEPTUNE` | Discord Developer Portal の BOT トークン |
| `DATABASE_URL`          | PostgreSQL 接続 URI                      |
| `REDIS_URL`             | Redis 接続 URI                           |

## 注意事項

初回ビルドは GHC コンパイルのため長時間かかります（数分単位）。レイヤーキャッシュにより2回目以降は高速化されます。
