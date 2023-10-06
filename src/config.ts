import dotenv from "dotenv";

dotenv.config();

const { ENV, DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !DISCORD_GUILD_ID) {
  throw new Error(
    "❌ | Missing environment variables - please check the .env.example file and include the correct variables in the .env file."
  );
}

export const config = {
  ENV,
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  DISCORD_GUILD_ID,
};
