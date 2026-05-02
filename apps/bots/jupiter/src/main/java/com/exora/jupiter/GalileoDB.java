package com.exora.jupiter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
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
    private static final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor(r -> {
        Thread t = new Thread(r, "jupiter-heartbeat");
        t.setDaemon(true);
        return t;
    });

    private GalileoDB() {
    }

    public static void init(String jdbcUrl) throws Exception {
        Class.forName("org.postgresql.Driver");
        String normalizedUrl = normalizeJdbcUrl(jdbcUrl);
        connection = DriverManager.getConnection(normalizedUrl);
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

    private static String normalizeJdbcUrl(String rawUrl) {
        if (rawUrl.startsWith("jdbc:")) {
            return rawUrl;
        }
        String pgUrl = rawUrl;
        if (pgUrl.startsWith("postgres://")) {
            pgUrl = "postgresql://" + pgUrl.substring("postgres://".length());
        }
        if (!pgUrl.startsWith("postgresql://")) {
            return rawUrl;
        }

        try {
            URI uri = URI.create(pgUrl);
            String host = uri.getHost();
            if (host == null || host.isBlank()) {
                return "jdbc:" + pgUrl;
            }

            StringBuilder jdbc = new StringBuilder("jdbc:postgresql://").append(host);
            if (uri.getPort() > 0) {
                jdbc.append(':').append(uri.getPort());
            }

            String path = uri.getPath();
            if (path == null || path.isBlank()) {
                path = "/postgres";
            }
            jdbc.append(path);

            String query = uri.getQuery();
            StringBuilder queryBuilder = new StringBuilder(query == null ? "" : query);

            String userInfo = uri.getUserInfo();
            if (userInfo != null && !userInfo.isBlank()) {
                String[] parts = userInfo.split(":", 2);
                String user = parts.length > 0 ? parts[0] : "";
                String password = parts.length > 1 ? parts[1] : "";

                if (!user.isBlank() && (query == null || !query.contains("user="))) {
                    if (!queryBuilder.isEmpty())
                        queryBuilder.append('&');
                    queryBuilder.append("user=")
                            .append(URLEncoder.encode(user, StandardCharsets.UTF_8));
                }
                if (!password.isBlank() && (query == null || !query.contains("password="))) {
                    if (!queryBuilder.isEmpty())
                        queryBuilder.append('&');
                    queryBuilder.append("password=")
                            .append(URLEncoder.encode(password, StandardCharsets.UTF_8));
                }
            }

            if (!queryBuilder.isEmpty()) {
                jdbc.append('?').append(queryBuilder);
            }

            return jdbc.toString();
        } catch (Exception ignored) {
            return "jdbc:" + pgUrl;
        }
    }

    /** Updates last_heartbeat_at and inserts into heartbeat_logs every 10 seconds. */
    private static void startHeartbeat() {
        scheduler.scheduleAtFixedRate(() -> {
            if (connection == null)
                return;
            try {
                try (PreparedStatement ps = connection.prepareStatement(
                        "UPDATE bot_instances SET last_heartbeat_at = NOW() WHERE bot_name = 'jupiter'")) {
                    ps.executeUpdate();
                }
                try (PreparedStatement ps = connection.prepareStatement(
                        "INSERT INTO heartbeat_logs (bot_name, logged_at) VALUES ('jupiter', NOW())")) {
                    ps.executeUpdate();
                }
                log.debug("[jupiter] heartbeat sent");
            } catch (Exception e) {
                log.warn("[jupiter] heartbeat failed: {}", e.getMessage());
            }
        }, 10, 10, TimeUnit.SECONDS);
    }

    public static void logCommand(String commandName, String status, long latencyMs) {
        if (connection == null)
            return;
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
