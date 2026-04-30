# ----- Build stage -----
FROM haskell:9.6.3 AS build
WORKDIR /app
COPY stack.yaml package.yaml ./
RUN stack setup --no-terminal
RUN stack build --only-dependencies --no-terminal
COPY app ./app
RUN stack build --no-terminal --copy-bins --local-bin-path /app/bin

# ----- Runtime stage -----
FROM debian:bookworm-slim
RUN apt-get update && \
    apt-get install -y ca-certificates libpq5 && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /app/bin/neptune .
ENTRYPOINT ["./neptune"]
