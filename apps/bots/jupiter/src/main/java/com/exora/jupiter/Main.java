package com.exora.jupiter;

import com.exora.jupiter.command.PingCommand;
import discord4j.core.DiscordClientBuilder;
import discord4j.core.GatewayDiscordClient;
import discord4j.core.event.domain.interaction.ChatInputInteractionEvent;
import discord4j.core.event.domain.lifecycle.ReadyEvent;
import discord4j.discordjson.json.ApplicationCommandRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Mono;

public class Main {

    private static final Logger log = LoggerFactory.getLogger(Main.class);

    public static void main(String[] args) {
        String token = requireEnv("DISCORD_TOKEN_JUPITER");
        String dbUrl = requireEnv("DATABASE_URL");

        // Galileo DB health check + bot_instances upsert
        try {
            GalileoDB.init(dbUrl);
        } catch (Exception e) {
            log.error("Galileo DB connection failed: {}", e.getMessage());
            System.exit(1);
        }

        GatewayDiscordClient client = DiscordClientBuilder.create(token)
                .build()
                .login()
                .block();

        if (client == null) {
            log.error("Discord gateway connection failed");
            System.exit(1);
        }

        // Log ready
        client.on(ReadyEvent.class, event -> {
            log.info("Jupiter online as {}", event.getSelf().getTag());
            return Mono.empty();
        }).subscribe();

        // Register /ping as a global slash command
        long appId = client.getRestClient().getApplicationId().block();
        client.getRestClient().getApplicationService()
                .createGlobalApplicationCommand(appId,
                        ApplicationCommandRequest.builder()
                                .name("ping")
                                .description("Pong! Verify that Jupiter is online.")
                                .build())
                .subscribe();

        // Dispatch commands
        client.on(ChatInputInteractionEvent.class, event -> {
            if ("ping".equals(event.getCommandName())) {
                return PingCommand.handle(event);
            }
            return Mono.empty();
        }).subscribe();

        client.onDisconnect().block();
    }

    private static String requireEnv(String key) {
        String value = System.getenv(key);
        if (value == null || value.isBlank()) {
            throw new IllegalStateException("Missing required environment variable: " + key);
        }
        return value;
    }
}

        GatewayDiscordClient client = DiscordClientBuilder.create(token)
                .build()
                .login()
                .block();

        if (client == null) {
            log.error("Discord gateway connection failed");
            System.exit(1);
        }

        // Log ready
        client.on(ReadyEvent.class, event -> {
            log.info("Jupiter online as {}", event.getSelf().getTag());
            return Mono.empty();
        }).subscribe();

        // Register /ping as a global slash command
        long appId = client.getRestClient().getApplicationId().block();
        client.getRestClient().getApplicationService()
                .createGlobalApplicationCommand(appId,
                        ApplicationCommandRequest.builder()
                                .name("ping")
                                .description("Pong! Verify that Jupiter is online.")
                                .build())
                .subscribe();

        // Dispatch commands
        client.on(ChatInputInteractionEvent.class, event -> {
            if ("ping".equals(event.getCommandName())) {
                return PingCommand.handle(event);
            }
            return Mono.empty();
        }).subscribe();

        client.onDisconnect().block();
    }

    private static String requireEnv(String key) {
        String value = System.getenv(key);
        if (value == null || value.isBlank()) {
            throw new IllegalStateException("Missing required environment variable: " + key);
        }
        return value;
    }
}
