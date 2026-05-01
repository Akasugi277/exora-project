# Development Phases / 開発フェーズ

## Phase 0 — Foundation ✔️

- Monorepo initialization
- Secret management baseline
- Docker base infra (PostgreSQL, Redis)

**日本語**: モノリポ構築・シークレット管理基盤・Docker 基盤インフラ（PostgreSQL・Redis）

## Phase 1 — Contracts & Scaffold ✔️

- Shared schema and proto contracts
- Bot and dashboard scaffold

**日本語**: 共有スキーマ・proto 定義・各サービスのスカフォールド作成

## Phase 2 — Core Bot Implementation ✔️

- Implement `/ping` and `/info` on all four bots
- Persist command events into Galileo DB
- PostgreSQL heartbeat from each bot
- Docker Compose: all 7 services running

**日本語**: 全 4 BOT に `/ping`・`/info` コマンドを実装。Galileo DB へのイベント記録とハートビート。
Docker Compose で全サービスが稼働中。

## Phase 3 — Dashboard & Observability (current)

- Dashboard status and command observability
- i18n support (Japanese / English)
- CI checks: lint, test, secret scan

**日本語**: ダッシュボードのステータス表示・多言語対応（日英）・CI 構築

## Phase 4 — Planned

- Discord OAuth2 login for dashboard (dedicated 5th application)
- Role-based access control
- Command history and analytics

**日本語**: ダッシュボードへの Discord OAuth2 ログイン・ロールベースアクセス制御・コマンド履歴分析
