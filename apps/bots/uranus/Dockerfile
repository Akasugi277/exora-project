# ----- Build stage -----
FROM rust:1.78-slim-bookworm AS build
RUN apt-get update && \
    apt-get install -y pkg-config libssl-dev libpq-dev && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /app
# Cache dependency layer
COPY Cargo.toml Cargo.lock* ./
RUN mkdir src && echo "fn main(){}" > src/main.rs && cargo build --release
RUN rm src/main.rs
# Real build
COPY src ./src
RUN touch src/main.rs && cargo build --release

# ----- Runtime stage -----
FROM debian:bookworm-slim
RUN apt-get update && \
    apt-get install -y ca-certificates libssl3 libpq5 && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /app/target/release/uranus .
ENTRYPOINT ["./uranus"]
