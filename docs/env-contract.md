# ENV Contract / 環境変数契約

This document defines baseline environment variables shared by all Exora services.

全 Exora サービスで共有する環境変数の定義です。

## Core / 基本

| Variable       | Description        | 説明                |
| -------------- | ------------------ | ------------------- |
| `PROJECT_NAME` | Project identifier | プロジェクト識別子  |
| `DATABASE_URL` | PostgreSQL URI     | PostgreSQL 接続 URI |
| `REDIS_URL`    | Redis URI          | Redis 接続 URI      |

## Bot tokens / BOT トークン

| Variable                | Bot                 | Discord Application |
| ----------------------- | ------------------- | ------------------- |
| `DISCORD_TOKEN_JUPITER` | Jupiter (Java)      | Application #1      |
| `DISCORD_TOKEN_SATURN`  | Saturn (TypeScript) | Application #2      |
| `DISCORD_TOKEN_URANUS`  | Uranus (Rust)       | Application #3      |
| `DISCORD_TOKEN_NEPTUNE` | Neptune (Haskell)   | Application #4      |

> 各 BOT は Discord Developer Portal で個別の Application として登録すること。
> ダッシュボードの OAuth2 ログインには第5の Application（"Exora Dashboard"）を別途作成する。

## Runtime ports / ポート

| Variable         | Service   | Default |
| ---------------- | --------- | ------- |
| `JUPITER_PORT`   | Jupiter   | 8080    |
| `SATURN_PORT`    | Saturn    | 8081    |
| `URANUS_PORT`    | Uranus    | 8082    |
| `NEPTUNE_PORT`   | Neptune   | 8083    |
| `DASHBOARD_PORT` | Dashboard | 3000    |

## Containers / コンテナ一覧

プロジェクトは以下の Docker コンテナで構成されます。

| コンテナ名        | イメージ / 言語           | 役割                                                                                                                  |
| ----------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `exora-postgres`  | PostgreSQL 16 Alpine      | **Galileo DB** — 全サービスが共有するメイン RDB。マイグレーションは `data/galileo-db/migrations/` で管理。            |
| `exora-redis`     | Redis 7 Alpine            | キャッシュ・Pub/Sub バス。Neptune がハートビートや一時データの格納に利用。                                            |
| `exora-jupiter`   | Java 21 / Discord4J       | Discord BOT #1。スラッシュコマンド (`/ping`, `/info`) を提供。起動時に Galileo DB へ `bot_instances` を upsert する。 |
| `exora-saturn`    | Node.js / discord.js      | Discord BOT #2 (TypeScript)。Jupiter と同等のコマンドセットを持ち、30 秒ごとにハートビートを DB へ送信。              |
| `exora-uranus`    | Rust / Serenity           | Discord BOT #3。軽量・低メモリで動作。sqlx で Galileo DB に接続し、稼働状況を記録。                                   |
| `exora-neptune`   | Haskell / discord-haskell | Discord BOT #4。Redis と Galileo DB の両方に接続し、ハートビートループをバックグラウンドスレッドで実行。              |
| `exora-dashboard` | Next.js 14 (App Router)   | Web 管理ダッシュボード (ポート 3000)。全 BOT の稼働状態をリアルタイム表示。Discord OAuth2 によるログイン機能を持つ。  |

> `exora-postgres` と `exora-redis` はインフラ層、その他は全てアプリケーション層のコンテナです。
> 各 BOT コンテナは起動時に `bot_instances` テーブルへ自身の情報を upsert し、ダッシュボードがそれを参照して稼働状態を表示します。

## Rules / ルール

1. `.env` is local-only and must never be committed. / `.env` はリポジトリにコミットしない。
2. `.env.example` is committed and must stay secret-free. / `.env.example` はコミットし、実際の値は含めない。
3. New services should extend this contract without renaming existing keys. / 新サービスは既存キーを改名せず拡張する。
