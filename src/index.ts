import { Client, Events, GatewayIntentBits, EmbedBuilder } from "discord.js";
import { config } from "./config";
import { Player } from "discord-player";
import { commands } from "./commands";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const player = new Player(client);

(async () => {
  await player.extractors.loadDefault();
})();

player.events.on("playerStart", (queue, track) => {
  // we will later define queue.metadata object while creating the queue
  queue.metadata.channel.send(`Started playing **${track.title}**!`);
});

client.login(config.DISCORD_TOKEN);

client.once(Events.ClientReady, (c) => {
  console.log(`Discord bot is ready! logged in as ${c.user.tag} 🤖`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "embed") {
    const embed = new EmbedBuilder()
      .setTitle("RBS-BOT")
      .setDescription("Play music with your friends on the voice channel")
      .setAuthor({
        name: "Rotem Bar-Sela",
        url: "https://www.linkedin.com/in/rotembarsela",
      })
      .setColor("Purple")
      .addFields(
        {
          name: "Field Title",
          value: "Random Field",
          inline: true,
        },
        {
          name: "Second Field Title",
          value: "Second Random Field",
          inline: true,
        }
      );

    interaction.reply({ embeds: [embed] });
  }

  if (interaction.commandName === "ping") {
    interaction.reply("hello");
  }

  if (interaction.commandName === "play") {
    await commands.play.execute(interaction, client);
  }
});

client.on("messageCreate", (message) => {
  if (message.content === "embed") {
    const embed = new EmbedBuilder()
      .setTitle("RBS-BOT")
      .setDescription("Play music with your friends on the voice channel")
      .setAuthor({
        name: "Rotem Bar-Sela",
        url: "https://www.linkedin.com/in/rotembarsela",
      })
      .setColor("Purple")
      .addFields(
        {
          name: "Field Title",
          value: "Random Field",
          inline: true,
        },
        {
          name: "Second Field Title",
          value: "Second Random Field",
          inline: true,
        }
      );

    message.reply({ embeds: [embed] });
  }

  console.log(message.content);
  console.log(message.createdAt.toDateString());
  console.log(message.author.tag);
});

client.on("channelPinsUpdate", (channel, date) => {});
