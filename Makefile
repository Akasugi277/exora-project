.DEFAULT_GOAL := help

.PHONY: help env up down logs reset

help:
	@printf "  %-12s %s\n" "env"   "Copy .env.example → .env (skips if already exists)"
	@printf "  %-12s %s\n" "up"    "Start PostgreSQL and Redis"
	@printf "  %-12s %s\n" "down"  "Stop all containers"
	@printf "  %-12s %s\n" "logs"  "Follow container logs"
	@printf "  %-12s %s\n" "reset" "Stop containers and delete volumes (destructive)"

env:
	@if [ ! -f .env ]; then cp .env.example .env && echo ".env created from .env.example"; \
	else echo ".env already exists, skipping"; fi

up: env
	docker compose up -d postgres redis

down:
	docker compose down

logs:
	docker compose logs -f

reset:
	docker compose down -v
