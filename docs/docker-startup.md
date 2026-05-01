# Docker Startup Manual / Docker 起動マニュアル

---

## English

### Prerequisites

| Requirement                 | Version                    |
| --------------------------- | -------------------------- |
| Docker Desktop              | 24.0 or later              |
| Docker Compose (Compose v2) | included in Docker Desktop |
| Discord bot tokens          | 4 tokens (one per bot)     |

### 1. Clone the repository

```bash
git clone <repo-url> exora-project
cd exora-project
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` in your editor and fill in the required values:

```dotenv
# Bot tokens (from Discord Developer Portal)
DISCORD_TOKEN_JUPITER=your_jupiter_token
DISCORD_TOKEN_SATURN=your_saturn_token
DISCORD_TOKEN_URANUS=your_uranus_token
DISCORD_TOKEN_NEPTUNE=your_neptune_token

# Database
DATABASE_URL=postgresql://exora:secret@postgres:5432/galileo
POSTGRES_USER=exora
POSTGRES_PASSWORD=secret
POSTGRES_DB=galileo

# Redis
REDIS_URL=redis://redis:6379

# Dashboard
DASHBOARD_PORT=3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

> **Important**: Never commit `.env`. It is listed in `.gitignore`.

### 3. Build and start all services

```bash
docker compose up -d --build
```

This command:

1. Builds Docker images for all 4 bots and the dashboard
2. Starts PostgreSQL and Redis
3. Runs DB migrations
4. Starts all 4 bots and the dashboard

Expected output:

```
[+] Running 7/7
 ✔ Container exora-postgres   Healthy
 ✔ Container exora-redis      Healthy
 ✔ Container exora-jupiter    Started
 ✔ Container exora-saturn     Started
 ✔ Container exora-uranus     Started
 ✔ Container exora-neptune    Started
 ✔ Container exora-dashboard  Started
```

### 4. Verify services

```bash
# Check all containers are running
docker compose ps

# Check logs for a specific bot
docker compose logs -f jupiter
docker compose logs -f saturn
docker compose logs -f uranus
docker compose logs -f neptune

# Check dashboard
docker compose logs -f dashboard
```

Look for these lines in the logs to confirm each bot is online:

- **Jupiter**: `Jupiter online as Exora-(J)#...`
- **Saturn**: `Online as Exora-(S)#...`
- **Uranus**: `Uranus is connected.`
- **Neptune**: `Started discord connection`

### 5. Access the dashboard

Open **http://localhost:3000** in your browser. All four bot status cards should show `online`.

### 6. Stop all services

```bash
docker compose down
```

To also remove volumes (database data):

```bash
docker compose down -v
```

### 7. Rebuild after code changes

```bash
# Rebuild only a specific service
docker compose up -d --build jupiter

# Rebuild all services
docker compose up -d --build
```

### Troubleshooting

| Problem                              | Solution                                                        |
| ------------------------------------ | --------------------------------------------------------------- |
| Bot shows `unknown` in dashboard     | Check DB migration ran; verify `DATABASE_URL` in `.env`         |
| `No suitable driver` error (Jupiter) | Verify `DATABASE_URL` uses `postgresql://` scheme               |
| Neptune build takes too long         | First build compiles GHC (~10 min); subsequent builds use cache |
| Port 3000 already in use             | Change `DASHBOARD_PORT` in `.env` and `docker-compose.yml`      |
| Discord token invalid                | Regenerate token in Discord Developer Portal                    |

---

## 日本語

### 前提条件

| 要件                        | バージョン            |
| --------------------------- | --------------------- |
| Docker Desktop              | 24.0 以上             |
| Docker Compose (Compose v2) | Docker Desktop に同梱 |
| Discord BOT トークン        | 4つ（BOT ごとに1つ）  |

### 1. リポジトリのクローン

```bash
git clone <repo-url> exora-project
cd exora-project
```

### 2. 環境変数の設定

```bash
cp .env.example .env
```

`.env` をエディタで開き、必要な値を入力します。

```dotenv
# BOT トークン（Discord Developer Portal で取得）
DISCORD_TOKEN_JUPITER=your_jupiter_token
DISCORD_TOKEN_SATURN=your_saturn_token
DISCORD_TOKEN_URANUS=your_uranus_token
DISCORD_TOKEN_NEPTUNE=your_neptune_token

# データベース
DATABASE_URL=postgresql://exora:secret@postgres:5432/galileo
POSTGRES_USER=exora
POSTGRES_PASSWORD=secret
POSTGRES_DB=galileo

# Redis
REDIS_URL=redis://redis:6379

# ダッシュボード
DASHBOARD_PORT=3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

> **重要**: `.env` は絶対にコミットしないでください。`.gitignore` に登録されています。

### 3. 全サービスのビルドと起動

```bash
docker compose up -d --build
```

このコマンドは以下を行います：

1. 4つの BOT とダッシュボードの Docker イメージをビルド
2. PostgreSQL と Redis を起動
3. DB マイグレーションを実行
4. 全 BOT とダッシュボードを起動

正常に起動すると以下のような出力になります：

```
[+] Running 7/7
 ✔ Container exora-postgres   Healthy
 ✔ Container exora-redis      Healthy
 ✔ Container exora-jupiter    Started
 ✔ Container exora-saturn     Started
 ✔ Container exora-uranus     Started
 ✔ Container exora-neptune    Started
 ✔ Container exora-dashboard  Started
```

### 4. 起動確認

```bash
# 全コンテナの状態確認
docker compose ps

# 個別のログ確認
docker compose logs -f jupiter
docker compose logs -f saturn
docker compose logs -f uranus
docker compose logs -f neptune
docker compose logs -f dashboard
```

各 BOT がオンラインになると以下のログが出力されます：

- **Jupiter**: `Jupiter online as Exora-(J)#...`
- **Saturn**: `Online as Exora-(S)#...`
- **Uranus**: `Uranus is connected.`
- **Neptune**: `Started discord connection`

### 5. ダッシュボードへのアクセス

ブラウザで **http://localhost:3000** を開きます。4つの BOT ステータスカードがすべて `online` と表示されれば成功です。

言語切り替えは右上のボタン、または URL に `?lang=ja`（日本語）/ `?lang=en`（英語）を付加します。

### 6. サービスの停止

```bash
docker compose down
```

データ（DB ボリューム）も含めて削除する場合：

```bash
docker compose down -v
```

### 7. コード変更後の再ビルド

```bash
# 特定のサービスのみ再ビルド
docker compose up -d --build jupiter

# 全サービスを再ビルド
docker compose up -d --build
```

### トラブルシューティング

| 問題                                     | 解決方法                                                             |
| ---------------------------------------- | -------------------------------------------------------------------- |
| ダッシュボードで BOT が `unknown` と表示 | DB マイグレーション実行確認、`.env` の `DATABASE_URL` を確認         |
| `No suitable driver` エラー (Jupiter)    | `DATABASE_URL` が `postgresql://` 形式であることを確認               |
| Neptune のビルドが非常に遅い             | 初回は GHC コンパイルで約10分かかります。2回目以降はキャッシュで高速 |
| ポート 3000 が使用中                     | `.env` と `docker-compose.yml` の `DASHBOARD_PORT` を変更            |
| Discord トークンが無効                   | Discord Developer Portal でトークンを再生成                          |

### Discord Developer Portal との対応

各 BOT と本プロジェクトは Discord Developer Portal 上で以下の Application に対応しています：

| Application 名  | 用途                           | トークン変数                                  |
| --------------- | ------------------------------ | --------------------------------------------- |
| Exora-(J)       | Jupiter BOT                    | `DISCORD_TOKEN_JUPITER`                       |
| Exora-(S)       | Saturn BOT                     | `DISCORD_TOKEN_SATURN`                        |
| Exora-(U)       | Uranus BOT                     | `DISCORD_TOKEN_URANUS`                        |
| Exora-(N)       | Neptune BOT                    | `DISCORD_TOKEN_NEPTUNE`                       |
| Exora Dashboard | ダッシュボード OAuth2 ログイン | `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` |

> BOT トークンと OAuth2 ログイン用クレデンシャルは必ず分離してください。
