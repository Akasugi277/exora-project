package com.exora.jupiter.command;

import discord4j.core.event.domain.interaction.ChatInputInteractionEvent;
import reactor.core.publisher.Mono;

public final class PingCommand {

    private PingCommand() {}

    public static Mono<Void> handle(ChatInputInteractionEvent event) {
        return event.reply("\uD83E\uFA90 Pong! **Jupiter** (Java / Discord4J) is online.");
    }
}
