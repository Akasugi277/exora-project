package com.exora.jupiter.command;

import com.exora.jupiter.GalileoDB;
import discord4j.core.event.domain.interaction.ChatInputInteractionEvent;
import reactor.core.publisher.Mono;

import java.lang.management.ManagementFactory;
import java.time.Duration;

public final class InfoCommand {

    private static final long START_TIME_MS = ManagementFactory.getRuntimeMXBean().getStartTime();

    private InfoCommand() {
    }

    public static Mono<Void> handle(ChatInputInteractionEvent event) {
        long start = System.currentTimeMillis();
        String reply = buildReply();
        return event.reply(reply)
                .doOnSuccess(v -> GalileoDB.logCommand("info", "ok", System.currentTimeMillis() - start))
                .doOnError(e -> GalileoDB.logCommand("info", "error", System.currentTimeMillis() - start));
    }

    private static String buildReply() {
        long uptimeMs = System.currentTimeMillis() - START_TIME_MS;
        Duration d = Duration.ofMillis(uptimeMs);
        long hours = d.toHours();
        long minutes = d.toMinutesPart();
        long seconds = d.toSecondsPart();
        String uptime = String.format("%dh %02dm %02ds", hours, minutes, seconds);

        return "🪐 **Jupiter** — Bot Information\n" +
                "• Language  : Java 21 / Discord4J 3.2.6\n" +
                "• Version   : 0.1.0\n" +
                "• Uptime    : " + uptime;
    }
}
