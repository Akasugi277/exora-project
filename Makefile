.DEFAULT_GOAL := help

.PHONY: help env up up-all down logs reset \
        build-jupiter build-saturn build-uranus build-neptune build-dashboard \
        run-jupiter run-saturn run-uranus run-neptune run-dashboard \
        logs-jupiter logs-saturn logs-uranus logs-neptune logs-dashboard

help:
	@printf "  %-20s %s\n" "env"               "Copy .env.example → .env (skip if exists)"
	@printf "  %-20s %s\n" "up"                "Start PostgreSQL and Redis only"
	@printf "  %-20s %s\n" "up-all"            "Start all services (infra + all bots + dashboard)"
	@printf "  %-20s %s\n" "down"              "Stop all containers"
	@printf "  %-20s %s\n" "logs"              "Follow logs for all containers"
	@printf "  %-20s %s\n" "reset"             "Stop and delete all volumes (destructive)"
	@printf "  %-20s %s\n" "build-<service>"   "Build a single service image"
	@printf "  %-20s %s\n" "run-<service>"     "Start a single bot/dashboard container"
	@printf "  %-20s %s\n" "logs-<service>"    "Follow logs for one service"

env:
	@if [ ! -f .env ]; then cp .env.example .env && echo ".env created"; \
	else echo ".env already exists, skipping"; fi

up: env
	docker compose up -d postgres redis

up-all: env
	docker compose up -d --build

down:
	docker compose down

logs:
	docker compose logs -f

reset:
	docker compose down -v

# --- per-service build ---
build-jupiter:
	docker compose build jupiter
build-saturn:
	docker compose build saturn
build-uranus:
	docker compose build uranus
build-neptune:
	docker compose build neptune
build-dashboard:
	docker compose build dashboard

# --- per-service run (infra must be up first) ---
run-jupiter:
	docker compose up -d jupiter
run-saturn:
	docker compose up -d saturn
run-uranus:
	docker compose up -d uranus
run-neptune:
	docker compose up -d neptune
run-dashboard:
	docker compose up -d dashboard

# --- per-service logs ---
logs-jupiter:
	docker compose logs -f jupiter
logs-saturn:
	docker compose logs -f saturn
logs-uranus:
	docker compose logs -f uranus
logs-neptune:
	docker compose logs -f neptune
logs-dashboard:
	docker compose logs -f dashboard
