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

## Rules / ルール

1. `.env` is local-only and must never be committed. / `.env` はリポジトリにコミットしない。
2. `.env.example` is committed and must stay secret-free. / `.env.example` はコミットし、実際の値は含めない。
3. New services should extend this contract without renaming existing keys. / 新サービスは既存キーを改名せず拡張する。
