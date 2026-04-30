use serenity::async_trait;
use serenity::builder::{
    CreateCommand, CreateInteractionResponse, CreateInteractionResponseMessage,
};
use serenity::model::application::{Command, Interaction};
use serenity::model::gateway::Ready;
use serenity::prelude::*;
use sqlx::postgres::PgPoolOptions;
use tracing::{error, info};

struct Handler;

#[async_trait]
impl EventHandler for Handler {
    async fn ready(&self, ctx: Context, ready: Ready) {
        info!("Uranus online as {}", ready.user.name);

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
                let msg = CreateInteractionResponseMessage::new()
                    .content("\u{1FA90} Pong! **Uranus** (Rust / Serenity) is online.");
                let response = CreateInteractionResponse::Message(msg);
                if let Err(e) = command.create_response(&ctx.http, response).await {
                    error!("Failed to respond to /ping: {e}");
                }
            }
        }
    }
}

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();
    tracing_subscriber::fmt::init();

    let token   = require_env("DISCORD_TOKEN_URANUS");
    let db_url  = require_env("DATABASE_URL");
    let redis_url = std::env::var("REDIS_URL")
        .unwrap_or_else(|_| "redis://localhost:6379".into());

    // Galileo DB health check
    match PgPoolOptions::new()
        .max_connections(2)
        .connect(&db_url)
        .await
    {
        Ok(pool) => {
            sqlx::query("SELECT 1")
                .execute(&pool)
                .await
                .expect("DB query failed");
            info!("Galileo DB connected");
        }
        Err(e) => {
            error!("Galileo DB connection failed: {e}");
            std::process::exit(1);
        }
    }

    // Redis health check
    match redis::Client::open(redis_url.as_str()) {
        Ok(client) => {
            match client.get_async_connection().await {
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
            }
        }
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

    if let Err(e) = client.start().await {
        error!("Discord client error: {e}");
    }
}

fn require_env(key: &str) -> String {
    std::env::var(key).unwrap_or_else(|_| panic!("Missing required env var: {key}"))
}
