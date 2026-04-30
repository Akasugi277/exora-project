package com.exora.jupiter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Lightweight DB helper for Galileo (PostgreSQL).
 * Uses a single connection; suitable for low-volume Discord bots.
 */
public final class GalileoDB {

    private static final Logger log = LoggerFactory.getLogger(GalileoDB.class);
    private static volatile Connection connection;
    private static final ScheduledExecutorService scheduler =
            Executors.newSingleThreadScheduledExecutor(r -> {
                Thread t = new Thread(r, "jupiter-heartbeat");
                t.setDaemon(true);
                return t;
            });

    private GalileoDB() {}

    public static void init(String jdbcUrl) throws Exception {
        connection = DriverManager.getConnection(jdbcUrl);
        log.info("[jupiter] Galileo DB connected: {}", connection.getMetaData().getURL());

        // Upsert bot_instances row
        try (PreparedStatement ps = connection.prepareStatement(
                "INSERT INTO bot_instances (bot_name, language, status, last_heartbeat_at) " +
                "VALUES ('jupiter', 'Java', 'online', NOW()) " +
                "ON CONFLICT (bot_name) DO UPDATE SET status = 'online', last_heartbeat_at = NOW()")) {
            ps.executeUpdate();
        }

        startHeartbeat();
    }

    /** Updates last_heartbeat_at every 30 seconds. */
    private static void startHeartbeat() {
        scheduler.scheduleAtFixedRate(() -> {
            if (connection == null) return;
            try (PreparedStatement ps = connection.prepareStatement(
                    "UPDATE bot_instances SET last_heartbeat_at = NOW() WHERE bot_name = 'jupiter'")) {
                ps.executeUpdate();
                log.debug("[jupiter] heartbeat sent");
            } catch (Exception e) {
                log.warn("[jupiter] heartbeat failed: {}", e.getMessage());
            }
        }, 30, 30, TimeUnit.SECONDS);
    }

    public static void logCommand(String commandName, String status, long latencyMs) {
        if (connection == null) return;
        try (PreparedStatement ps = connection.prepareStatement(
                "INSERT INTO command_logs (bot_name, command_name, status, latency_ms, created_at) " +
                "VALUES ('jupiter', ?, ?, ?, NOW())")) {
            ps.setString(1, commandName);
            ps.setString(2, status);
            ps.setLong(3, latencyMs);
            ps.executeUpdate();
        } catch (Exception e) {
            log.warn("[jupiter] command_logs insert failed: {}", e.getMessage());
        }
    }
}
