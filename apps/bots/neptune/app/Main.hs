module Main where

import Control.Exception                (SomeException, catch)
import Control.Concurrent               (forkIO, threadDelay)
import Control.Monad                    (void, forever)
import Data.Coerce                      (coerce)
import Data.Default                     (def)
import qualified Data.ByteString.Char8  as BS
import qualified Data.Text              as T
import Data.Time.Clock                  (diffUTCTime, getCurrentTime, UTCTime)
import Discord
import Discord.Types
import qualified Discord.Requests       as R
import qualified Database.PostgreSQL.Simple as PG
import qualified Database.Redis         as Redis
import Configuration.Dotenv            (loadFile, defaultConfig)
import System.Environment              (lookupEnv)
import System.Exit                     (exitFailure)
import System.IO                       (hPutStrLn, stderr)

-- ---------------------------------------------------------------------------
-- Entry point
-- ---------------------------------------------------------------------------

main :: IO ()
main = do
  -- Load .env if present; silently skip in Docker where env vars are injected
  loadFile defaultConfig `catch` (\(_ :: SomeException) -> pure ())

  tok    <- T.pack <$> requireEnv "DISCORD_TOKEN_NEPTUNE"
  dbUrl  <- requireEnv "DATABASE_URL"
  redisH <- maybe "localhost" id <$> lookupEnv "REDIS_HOST"

  conn    <- checkGalileo dbUrl
  startAt <- getCurrentTime
  upsertBotInstance conn
  void $ forkIO $ heartbeatLoop conn
  checkRedis redisH

  err <- runDiscord $ def
    { discordToken   = tok
    , discordOnEvent = handleEvent conn startAt
    }
  hPutStrLn stderr ("[neptune] " <> T.unpack err)

-- ---------------------------------------------------------------------------
-- Event handler
-- ---------------------------------------------------------------------------

handleEvent :: PG.Connection -> UTCTime -> Event -> DiscordHandler ()
handleEvent conn _ (Ready {}) = do
  liftIO $ putStrLn "[neptune] online (Haskell / discord-haskell)"
  result <- restCall R.GetCurrentUser
  case result of
    Left  err -> liftIO $ hPutStrLn stderr ("[neptune] GetCurrentUser error: " <> show err)
    Right bot -> do
      void $ restCall $ R.CreateGlobalApplicationCommand
        (coerce (userId bot))
        def
          { createApplicationCommandName        = "ping"
          , createApplicationCommandDescription = "Pong! Verify that Neptune is online."
          }
      void $ restCall $ R.CreateGlobalApplicationCommand
        (coerce (userId bot))
        def
          { createApplicationCommandName        = "info"
          , createApplicationCommandDescription = "Show Neptune bot information and uptime."
          }
handleEvent conn startAt (InteractionCreate intr) = handleInteraction conn startAt intr
handleEvent _    _       _                         = pure ()

handleInteraction :: PG.Connection -> UTCTime -> Interaction -> DiscordHandler ()
handleInteraction conn startAt intr =
  case interactionData intr of
    Just (ApplicationCommandData { applicationCommandDataName = "ping" }) -> do
      start <- liftIO getCurrentTime
      res   <- restCall $ R.CreateInteractionResponse
        (interactionId    intr)
        (interactionToken intr)
        ( InteractionResponseChannelMessage $
            def { interactionResponseMessageContent =
                    Just "\x1FA90 Pong! **Neptune** (Haskell / discord-haskell) is online."
                }
        )
      end <- liftIO getCurrentTime
      let latencyMs = round (diffUTCTime end start * 1000) :: Int
          status    = case res of { Right _ -> "ok"; Left _ -> "error" }
      liftIO $ logCommand conn "ping" status latencyMs
    Just (ApplicationCommandData { applicationCommandDataName = "info" }) -> do
      start  <- liftIO getCurrentTime
      now    <- liftIO getCurrentTime
      let totalSecs = round (diffUTCTime now startAt) :: Int
          hours     = totalSecs `div` 3600
          mins      = (totalSecs `mod` 3600) `div` 60
          secs      = totalSecs `mod` 60
          uptime    = show hours <> "h " <> pad mins <> "m " <> pad secs <> "s"
          reply     = "\x1FA90 **Neptune** \x2014 Bot Information\n"
                   <> "\x2022 Language  : Haskell / discord-haskell\n"
                   <> "\x2022 Version   : 0.1.0\n"
                   <> "\x2022 Uptime    : " <> uptime
      res  <- restCall $ R.CreateInteractionResponse
        (interactionId    intr)
        (interactionToken intr)
        ( InteractionResponseChannelMessage $
            def { interactionResponseMessageContent = Just (T.pack reply) }
        )
      end <- liftIO getCurrentTime
      let latencyMs = round (diffUTCTime end start * 1000) :: Int
          status    = case res of { Right _ -> "ok"; Left _ -> "error" }
      liftIO $ logCommand conn "info" status latencyMs
    _ -> pure ()
  where
    pad n = (if n < 10 then "0" else "") <> show n

-- ---------------------------------------------------------------------------
-- DB helpers
-- ---------------------------------------------------------------------------

checkGalileo :: String -> IO PG.Connection
checkGalileo url = do
  conn <- PG.connectPostgreSQL (BS.pack url)
  _    <- PG.query_ conn "SELECT 1 :: INT" :: IO [PG.Only Int]
  putStrLn "[neptune] Galileo DB connected"
  return conn

upsertBotInstance :: PG.Connection -> IO ()
upsertBotInstance conn = do
  void $ PG.execute conn
    "INSERT INTO bot_instances (bot_name, language, status, last_heartbeat_at) \
    \VALUES ('neptune', 'Haskell', 'online', NOW()) \
    \ON CONFLICT (bot_name) DO UPDATE SET status = 'online', last_heartbeat_at = NOW()"
    ()

-- | Updates last_heartbeat_at every 30 seconds in a background thread.
heartbeatLoop :: PG.Connection -> IO ()
heartbeatLoop conn = forever $ do
  threadDelay (30 * 1_000_000)
  void (PG.execute conn
    "UPDATE bot_instances SET last_heartbeat_at = NOW() WHERE bot_name = 'neptune'"
    ())
    `catch` (\(_ :: SomeException) -> pure ())

logCommand :: PG.Connection -> String -> String -> Int -> IO ()
logCommand conn cmdName status latencyMs =
  void $ PG.execute conn
    "INSERT INTO command_logs (bot_name, command_name, status, latency_ms, created_at) \
    \VALUES ('neptune', ?, ?, ?, NOW())"
    (cmdName, status, latencyMs)

-- ---------------------------------------------------------------------------
-- Redis health check
-- ---------------------------------------------------------------------------

checkRedis :: String -> IO ()
checkRedis host = do
  redisConn <- Redis.connect Redis.defaultConnectInfo { Redis.connectHost = host }
  r    <- Redis.runRedis redisConn Redis.ping
  case r of
    Right _ -> putStrLn "[neptune] Redis connected"
    Left  e -> hPutStrLn stderr ("[neptune] Redis error: " <> show e)

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

requireEnv :: String -> IO String
requireEnv key = do
  val <- lookupEnv key
  case val of
    Nothing -> hPutStrLn stderr ("[neptune] Missing env var: " <> key) >> exitFailure
    Just v  -> return v
