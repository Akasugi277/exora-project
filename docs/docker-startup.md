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
DATABASE_URL=postgresql://galileo_user:change_me@localhost:5432/galileo
POSTGRES_USER=galileo_user
POSTGRES_PASSWORD=change_me
POSTGRES_DB=galileo

# Redis
REDIS_URL=redis://localhost:6379

# Discord OAuth2 (dashboard login — "Exora Dashboard" application)
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/callback
SESSION_SECRET=replace_with_random_32_char_string

# App ports
JUPITER_PORT=7001
SATURN_PORT=7002
URAN_PORT=7003
NEPTUNE_PORT=7004
DASHBOARD_PORT=3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

> **Important**: Never commit `.env`. It is listed in `.gitignore`.

### 2a. Set up the Discord Dashboard Application (OAuth2)

The dashboard login and the "Shared Servers" feature require a dedicated **5th Discord Application** (separate from the four bot tokens).

1. Open [Discord Developer Portal](https://discord.com/developers/applications) and click **New Application** → name it `Exora Dashboard`.
2. Go to **OAuth2** → **General** and copy the **Client ID** and **Client Secret** into `.env`.
3. Under **Redirects**, add `http://localhost:3000/api/auth/callback` and click **Save Changes**.
4. Under **OAuth2 → Scopes**, make sure your authorization URL includes **`identify`** and **`guilds`** scopes.
   - The `guilds` scope is required for the "Shared Servers" page to show which servers the logged-in user and each bot have in common.
5. Set `SESSION_SECRET` to a random string of 32 or more characters (e.g. `openssl rand -base64 32`).

> The `guilds.join` scope is **not** required — `guilds` (read-only) is sufficient.

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

If you encounter a **container name conflict** error (e.g. `The container name "/exora-dashboard" is already in use`), remove the stale container first:

```bash
docker rm -f exora-dashboard
docker compose up -d --build dashboard
```

### Troubleshooting

| Problem                                 | Solution                                                                                  |
| --------------------------------------- | ----------------------------------------------------------------------------------------- |
| Bot shows `unknown` in dashboard        | Check DB migration ran; verify `DATABASE_URL` in `.env`                                   |
| `No suitable driver` error (Jupiter)    | Verify `DATABASE_URL` uses `postgresql://` scheme                                         |
| Neptune build takes too long            | First build compiles GHC (~10 min); subsequent builds use cache                           |
| Port 3000 already in use                | Change `DASHBOARD_PORT` in `.env` and `docker-compose.yml`                                |
| Discord token invalid                   | Regenerate token in Discord Developer Portal                                              |
| Container name conflict on rebuild      | Run `docker rm -f <container-name>` then `docker compose up -d --build <service>`         |
| Dashboard login fails                   | Verify `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, and `DISCORD_REDIRECT_URI` in `.env` |
| "Shared Servers" page shows no results  | Log out and log in again — old sessions do not include the `guilds` scope                 |
| "Shared Servers" shows re-login warning | The session was created before `guilds` scope was added; log out and re-authenticate      |

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
DATABASE_URL=postgresql://galileo_user:change_me@localhost:5432/galileo
POSTGRES_USER=galileo_user
POSTGRES_PASSWORD=change_me
POSTGRES_DB=galileo

# Redis
REDIS_URL=redis://localhost:6379

# Discord OAuth2（ダッシュボードログイン用 — "Exora Dashboard" アプリケーション）
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/callback
SESSION_SECRET=ランダムな32文字以上の文字列

# アプリポート
JUPITER_PORT=7001
SATURN_PORT=7002
URANUS_PORT=7003
NEPTUNE_PORT=7004
DASHBOARD_PORT=3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

> **重要**: `.env` は絶対にコミットしないでください。`.gitignore` に登録されています。

### 2a. Discord ダッシュボード用 Application の設定（OAuth2）

ダッシュボードへのログインおよび「参加サーバー」機能には、BOT トークンとは別の **第5の Discord Application** が必要です。

1. [Discord Developer Portal](https://discord.com/developers/applications) を開き、**New Application** → アプリ名を `Exora Dashboard` に設定。
2. **OAuth2** → **General** から **Client ID** と **Client Secret** をコピーして `.env` に設定。
3. **Redirects** に `http://localhost:3000/api/auth/callback` を追加して **Save Changes**。
4. 認可 URL のスコープに **`identify`** と **`guilds`** を含めること。
   - `guilds` スコープはログインユーザーと各 BOT が共通して参加するサーバー一覧（「参加サーバー」ページ）の取得に必要です。
5. `SESSION_SECRET` には32文字以上のランダムな文字列を設定します（例: `openssl rand -base64 32`）。

> `guilds.join` スコープは**不要**です。読み取り専用の `guilds` スコープで十分です。

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

**コンテナ名の競合エラーが発生した場合**（例: `The container name "/exora-dashboard" is already in use`）、古いコンテナを先に削除してから再ビルドしてください：

```bash
docker rm -f exora-dashboard
docker compose up -d --build dashboard
```

### トラブルシューティング

| 問題                                           | 解決方法                                                                                             |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| ダッシュボードで BOT が `unknown` と表示       | DB マイグレーション実行確認、`.env` の `DATABASE_URL` を確認                                         |
| `No suitable driver` エラー (Jupiter)          | `DATABASE_URL` が `postgresql://` 形式であることを確認                                               |
| Neptune のビルドが非常に遅い                   | 初回は GHC コンパイルで約10分かかります。2回目以降はキャッシュで高速                                 |
| ポート 3000 が使用中                           | `.env` と `docker-compose.yml` の `DASHBOARD_PORT` を変更                                            |
| Discord トークンが無効                         | Discord Developer Portal でトークンを再生成                                                          |
| 再ビルド時にコンテナ名の競合エラー             | `docker rm -f <コンテナ名>` で古いコンテナを削除してから `docker compose up -d --build <サービス名>` |
| ダッシュボードへのログインが失敗する           | `.env` の `DISCORD_CLIENT_ID`・`DISCORD_CLIENT_SECRET`・`DISCORD_REDIRECT_URI` を確認                |
| 「参加サーバー」ページにサーバーが表示されない | ログアウトして再ログイン（古いセッションには `guilds` スコープが含まれていません）                   |
| 「参加サーバー」ページに再ログイン警告が出る   | `guilds` スコープ追加前に作成されたセッションです。ログアウトして再認証してください                  |

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
