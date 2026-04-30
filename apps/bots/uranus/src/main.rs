use serenity::async_trait;
use serenity::builder::{
    CreateCommand, CreateInteractionResponse, CreateInteractionResponseMessage,
};
use serenity::model::application::{Command, Interaction};
use serenity::model::gateway::Ready;
use serenity::prelude::*;
use sqlx::PgPool;
use sqlx::postgres::PgPoolOptions;
use std::time::{Duration, Instant};
use tracing::{error, info, warn};

// Share the PgPool through Serenity's TypeMap
struct DbPool;
impl TypeMapKey for DbPool {
    type Value = PgPool;
}

struct Handler;

#[async_trait]
impl EventHandler for Handler {
    async fn ready(&self, ctx: Context, ready: Ready) {
        info!("Uranus online as {}", ready.user.name);

        // Upsert bot_instances
        {
            let data = ctx.data.read().await;
            if let Some(pool) = data.get::<DbPool>() {
                if let Err(e) = sqlx::query(
                    "INSERT INTO bot_instances (bot_name, language, status, last_heartbeat_at) \
                     VALUES ('uranus', 'Rust', 'online', NOW()) \
                     ON CONFLICT (bot_name) DO UPDATE \
                       SET status = 'online', last_heartbeat_at = NOW()",
                )
                .execute(pool)
                .await
                {
                    warn!("bot_instances upsert failed: {e}");
                }
            }
        }

        match Command::create_global_command(
            &ctx.http,
            CreateCommand::new("ping").description("Pong! Verify that Uranus is online."),
        )
        .await
        {
            Ok(_) => info!("/ping registered"),
            Err(e) => error!("Failed to register /ping: {e}"),
        }
    }

    async fn interaction_create(&self, ctx: Context, interaction: Interaction) {
        if let Interaction::Command(command) = interaction {
            if command.data.name == "ping" {
                let start = Instant::now();
                let msg = CreateInteractionResponseMessage::new()
                    .content("\u{1FA90} Pong! **Uranus** (Rust / Serenity) is online.");
                let response = CreateInteractionResponse::Message(msg);
                let result = command.create_response(&ctx.http, response).await;
                let latency_ms = start.elapsed().as_millis() as i64;
                let status = if result.is_ok() { "ok" } else { "error" };

                if let Err(e) = &result {
                    error!("Failed to respond to /ping: {e}");
                }

                // Log to command_logs
                let data = ctx.data.read().await;
                if let Some(pool) = data.get::<DbPool>() {
                    if let Err(e) = sqlx::query(
                        "INSERT INTO command_logs \
                           (bot_name, command_name, status, latency_ms, created_at) \
                         VALUES ('uranus', 'ping', $1, $2, NOW())",
                    )
                    .bind(status)
                    .bind(latency_ms)
                    .execute(pool)
                    .await
                    {
                        warn!("command_logs insert failed: {e}");
                    }
                }
            }
        }
    }
}

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();
    tracing_subscriber::fmt::init();

    let token     = require_env("DISCORD_TOKEN_URANUS");
    let db_url    = require_env("DATABASE_URL");
    let redis_url = std::env::var("REDIS_URL")
        .unwrap_or_else(|_| "redis://localhost:6379".into());

    // Galileo DB — connect pool (used for the lifetime of the process)
    let pool = match PgPoolOptions::new()
        .max_connections(5)
        .connect(&db_url)
        .await
    {
        Ok(p) => {
            sqlx::query("SELECT 1").execute(&p).await.expect("DB query failed");
            info!("Galileo DB connected");
            p
        }
        Err(e) => {
            error!("Galileo DB connection failed: {e}");
            std::process::exit(1);
        }
    };

    // Redis health check
    match redis::Client::open(redis_url.as_str()) {
        Ok(client) => match client.get_async_connection().await {
            Ok(mut conn) => {
                let _: String = redis::cmd("PING")
                    .query_async(&mut conn)
                    .await
                    .expect("Redis PING failed");
                info!("Redis connected");
            }
            Err(e) => {
                error!("Redis connection failed: {e}");
                std::process::exit(1);
            }
        },
        Err(e) => {
            error!("Redis client error: {e}");
            std::process::exit(1);
        }
    }

    let intents = GatewayIntents::GUILDS;
    let mut client = Client::builder(&token, intents)
        .event_handler(Handler)
        .await
        .expect("Failed to create Discord client");

    // Share the pool via TypeMap
    {
        let mut data = client.data.write().await;
        data.insert::<DbPool>(pool.clone());
    }

    // Background heartbeat: update last_heartbeat_at every 30 s
    let heartbeat_pool = pool;
    tokio::spawn(async move {
        let mut interval = tokio::time::interval(Duration::from_secs(30));
        interval.tick().await; // skip the immediate first tick
        loop {
            interval.tick().await;
            if let Err(e) = sqlx::query(
                "UPDATE bot_instances SET last_heartbeat_at = NOW() WHERE bot_name = 'uranus'",
            )
            .execute(&heartbeat_pool)
            .await
            {
                warn!("heartbeat failed: {e}");
            } else {
                info!("heartbeat sent");
            }
        }
    });

    if let Err(e) = client.start().await {
        error!("Discord client error: {e}");
    }
}

fn require_env(key: &str) -> String {
    std::env::var(key).unwrap_or_else(|_| panic!("Missing required env var: {key}"))
}
