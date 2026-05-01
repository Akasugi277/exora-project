# Exora Dashboard Web UI

Status dashboard for all four Exora bots, Galileo DB, and Redis.

## Stack

| Item         | Value                   |
| ------------ | ----------------------- |
| Framework    | Next.js 14 (App Router) |
| Language     | TypeScript              |
| Output mode  | standalone              |
| DB client    | pg (node-postgres)      |
| Default port | 3000                    |

## Implemented features

- Real-time bot status cards (online/offline) for all 4 bots
- `/api/status` endpoint — queries `bot_instances` table in Galileo DB
- Language switcher: Japanese / English (`?lang=ja` / `?lang=en`)
- Dark theme UI

## Required environment variables

| Variable               | Description                     |
| ---------------------- | ------------------------------- |
| `DASHBOARD_PORT`       | Port to expose (default: 3000)  |
| `DATABASE_URL`         | PostgreSQL connection URI       |
| `REDIS_URL`            | Redis connection URI            |
| `NEXT_PUBLIC_BASE_URL` | Base URL for internal API calls |

## Local development

```bash
npm install
npm run dev      # start on http://localhost:3000
```

## Docker build

```bash
docker build -t dashboard .
```

## Language switching

Append `?lang=ja` or `?lang=en` to the URL, or use the toggle button on the page.

---

# Exora ダッシュボード（日本語）

4つの Exora BOT・Galileo DB・Redis の状態を監視するダッシュボードです。

## スタック

- Next.js 14 (App Router) / TypeScript
- standalone 出力モード（完全スタンドアロン Docker 対応）
- node-postgres で Galileo DB に直接クエリ

## 実装済み機能

- 全 4 BOT のステータスカード（online/offline）
- `/api/status` — `bot_instances` テーブルを参照
- 日本語 / 英語 切り替え（`?lang=ja` / `?lang=en`）

## 環境変数

| 変数名                 | 説明                           |
| ---------------------- | ------------------------------ |
| `DASHBOARD_PORT`       | 公開ポート（デフォルト: 3000） |
| `DATABASE_URL`         | PostgreSQL 接続 URI            |
| `REDIS_URL`            | Redis 接続 URI                 |
| `NEXT_PUBLIC_BASE_URL` | 内部 API 呼び出し用ベース URL  |
