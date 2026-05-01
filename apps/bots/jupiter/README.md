# Jupiter Bot (Java)

Jupiter is the Java implementation of the shared Exora bot specification.

## Stack

| Item              | Value                         |
| ----------------- | ----------------------------- |
| Language          | Java 21                       |
| Discord framework | Discord4J 3.2.6               |
| Build tool        | Gradle 8.8 (shadowJar)        |
| Base image        | eclipse-temurin:21-jre-alpine |

## Implemented features

- `/ping` — replies with latency and writes event to Galileo DB
- `/info` — shows bot version and uptime
- PostgreSQL heartbeat (updates `bot_instances` every 30 s)
- JDBC URL auto-normalization (`postgresql://` → `jdbc:postgresql://`)

## Required environment variables

| Variable                | Description                                                       |
| ----------------------- | ----------------------------------------------------------------- |
| `DISCORD_TOKEN_JUPITER` | Bot token from Discord Developer Portal                           |
| `DATABASE_URL`          | PostgreSQL connection URI (e.g. `postgresql://user:pass@host/db`) |
| `REDIS_URL`             | Redis connection URI (e.g. `redis://redis:6379`)                  |

## Local build

```bash
./gradlew shadowJar
java -jar build/libs/jupiter-all.jar
```

## Docker build

```bash
docker build -t jupiter .
```

---

# Jupiter Bot（日本語）

Jupiter は Exora BOT 仕様の Java 実装です。

## スタック

- Java 21 / Discord4J 3.2.6
- Gradle 8.8（shadowJar で実行可能 JAR を生成）
- Docker ベースイメージ: eclipse-temurin:21-jre-alpine

## 実装済み機能

- `/ping` — レイテンシを返信・DB にイベント記録
- `/info` — BOT バージョン・アップタイムを返信
- PostgreSQL ハートビート（30秒ごとに `bot_instances` を更新）
- DATABASE_URL の認識形式自動変換（`postgresql://` → JDBC 形式）

## 環境変数

| 変数名                  | 説明                                     |
| ----------------------- | ---------------------------------------- |
| `DISCORD_TOKEN_JUPITER` | Discord Developer Portal の BOT トークン |
| `DATABASE_URL`          | PostgreSQL 接続 URI                      |
| `REDIS_URL`             | Redis 接続 URI                           |
