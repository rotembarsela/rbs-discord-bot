import {
  Client,
  Events,
  GatewayIntentBits,
  REST,
  RESTPatchAPIApplicationGuildCommandResult,
  Routes,
  SharedNameAndDescription,
  SlashCommandBuilder,
} from "discord.js";
import { config } from "./config";

const TOKEN = config.DISCORD_TOKEN;
const CLIENT_ID = config.DISCORD_CLIENT_ID;
const GUILD_ID = config.DISCORD_GUILD_ID;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const rest = new REST().setToken(TOKEN);

(async () => {
  const pingCommand = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!");

  const commands: SharedNameAndDescription[] = [pingCommand];

  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = (await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    )) as RESTPatchAPIApplicationGuildCommandResult[];

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();

client.login(config.DISCORD_TOKEN);

client.once(Events.ClientReady, (c) => {
  console.log(`Discord bot is ready! logged in as ${c.user.tag} 🤖`);
});

client.on("interactionCreate", (interaction) => {
  if (interaction.isChatInputCommand()) {
    interaction.reply({ content: "Hey there!" });
  }
});

client.on("messageCreate", (message) => {
  console.log(message.content);
  console.log(message.createdAt.toDateString());
  console.log(message.author.tag);
});

client.on("channelPinsUpdate", (channel, date) => {});
