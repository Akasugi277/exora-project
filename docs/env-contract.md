# ENV Contract

This document defines baseline environment variables shared by all Exora services.

## Core

- PROJECT_NAME
- DATABASE_URL
- REDIS_URL

## Bot tokens

- DISCORD_TOKEN_JUPITER
- DISCORD_TOKEN_SATURN
- DISCORD_TOKEN_URANUS
- DISCORD_TOKEN_NEPTUNE

## Runtime ports

- JUPITER_PORT
- SATURN_PORT
- URANUS_PORT
- NEPTUNE_PORT
- DASHBOARD_PORT

## Rules

1. `.env` is local-only and must never be committed.
2. `.env.example` is committed and must stay secret-free.
3. New services should extend this contract without renaming existing keys.
