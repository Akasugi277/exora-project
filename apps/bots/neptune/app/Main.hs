module Main where

import Control.Exception                (SomeException, catch)
import Control.Monad                    (void)
import Data.Coerce                      (coerce)
import Data.Default                     (def)
import qualified Data.ByteString.Char8  as BS
import qualified Data.Text              as T
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

  checkGalileo dbUrl
  checkRedis redisH

  err <- runDiscord $ def
    { discordToken   = tok
    , discordOnEvent = handleEvent
    }
  hPutStrLn stderr ("[neptune] " <> T.unpack err)

-- ---------------------------------------------------------------------------
-- Event handler
-- ---------------------------------------------------------------------------

handleEvent :: Event -> DiscordHandler ()
handleEvent (Ready {}) = do
  liftIO $ putStrLn "[neptune] online (Haskell / discord-haskell)"
  -- The bot's user ID equals the application ID for all modern bots.
  result <- restCall R.GetCurrentUser
  case result of
    Left  err -> liftIO $ hPutStrLn stderr ("[neptune] GetCurrentUser error: " <> show err)
    Right bot ->
      void $ restCall $ R.CreateGlobalApplicationCommand
        (coerce (userId bot))                 -- UserId ≅ ApplicationId
        def
          { createApplicationCommandName        = "ping"
          , createApplicationCommandDescription = "Pong! Verify that Neptune is online."
          }

handleEvent (InteractionCreate intr) = handleInteraction intr
handleEvent _                         = pure ()

handleInteraction :: Interaction -> DiscordHandler ()
handleInteraction intr =
  case interactionData intr of
    Just (ApplicationCommandData { applicationCommandDataName = "ping" }) ->
      void $ restCall $ R.CreateInteractionResponse
        (interactionId    intr)
        (interactionToken intr)
        ( InteractionResponseChannelMessage $
            def { interactionResponseMessageContent =
                    Just "\x1FA90 Pong! **Neptune** (Haskell / discord-haskell) is online."
                }
        )
    _ -> pure ()

-- ---------------------------------------------------------------------------
-- Health checks
-- ---------------------------------------------------------------------------

checkGalileo :: String -> IO ()
checkGalileo url = do
  conn <- PG.connectPostgreSQL (BS.pack url)
  _    <- PG.query_ conn "SELECT 1 :: INT" :: IO [PG.Only Int]
  PG.close conn
  putStrLn "[neptune] Galileo DB connected"

checkRedis :: String -> IO ()
checkRedis host = do
  conn <- Redis.connect Redis.defaultConnectInfo { Redis.connectHost = host }
  r    <- Redis.runRedis conn Redis.ping
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
