package com.exora.jupiter.command;

import com.exora.jupiter.GalileoDB;
import discord4j.core.event.domain.interaction.ChatInputInteractionEvent;
import reactor.core.publisher.Mono;

public final class PingCommand {

    private PingCommand() {
    }

    public static Mono<Void> handle(ChatInputInteractionEvent event) {
        long start = System.currentTimeMillis();
        return event.reply("\uD83E\uFA90 Pong! **Jupiter** (Java / Discord4J) is online.")
                .doOnSuccess(v -> GalileoDB.logCommand("ping", "ok", System.currentTimeMillis() - start))
                .doOnError(e -> GalileoDB.logCommand("ping", "error", System.currentTimeMillis() - start));
    }
}
