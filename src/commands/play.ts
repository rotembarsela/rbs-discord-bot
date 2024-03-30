import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Client,
  EmbedBuilder,
  GuildResolvable,
} from "discord.js";
import { useMainPlayer, Player, useQueue } from "discord-player";

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("new play command")
  .addStringOption((option) =>
    option.setName("query").setDescription("url").setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("247")
      .setDescription("24/7")
      .addChoices(
        { name: "yes", value: "false" },
        { name: "no", value: "true" }
      )
  );

export async function execute(
  interaction: ChatInputCommandInteraction,
  client: Client
) {
  const member = client.guilds.cache
    .get(interaction.guildId ?? "")
    ?.members.cache.get(interaction.member?.user.id ?? "");

  if (!member?.voice.channelId) {
    return await interaction.reply({
      content: `❌ | You have to join a Voice Channel`,
      ephemeral: true,
    });
  }

  if (
    interaction.guild?.members.me?.voice.channelId &&
    member.voice.channelId !== interaction.guild.members.me.voice.channelId
  ) {
    return await interaction.reply({
      content: `❌ | ${interaction.guild.members.me.voice.channel}`,
      ephemeral: true,
    });
  }

  const query = interaction.options.getString("query", true); // we need input/query to play

  const player = useMainPlayer() as Player;

  const { track } = await player.play(member?.voice.channelId, query, {
    nodeOptions: {
      // nodeOptions are the options for guild node (aka your queue in simple word)
      metadata: interaction, // we can access this metadata object using queue.metadata later on
    },
  });

  if (!query) {
    const queue = useQueue(interaction.guildId ?? "");

    if (queue) {
      const track = queue.history.currentTrack;
      if (track) {
        const embed = new EmbedBuilder()
          .setDescription(
            `${queue.node.createProgressBar()}\n\n ${track.requestedBy}`
          )
          .setTitle(track.title + " • " + track.author)
          .setURL(track.url)
          .setThumbnail(track.thumbnail)
          .setFooter({ text: track.author })
          .setTimestamp();
        return await interaction.reply({ embeds: [embed] });
      }
    }
    const embed = new EmbedBuilder().setDescription(`❌`);
    return await interaction.reply({ embeds: [embed] });
  }

  const queue = player.nodes.create(interaction.guild as GuildResolvable, {
    defaultFFmpegFilters: ["silenceremove"],
    metadata: {
      channel: interaction.channel,
    } as any, // MetaData
  });

  await interaction.deferReply();

  try {
    const result = await player
      .search(query, {
        requestedBy: interaction.user,
      })
      .then((x) => {
        console.log(x);
        return x;
      });

    if (result.isEmpty()) {
      const embed = new EmbedBuilder().setDescription(`❌ | \`${query}\`.`);
      return await interaction.followUp({ embeds: [embed] });
    }

    let title;
    if (result.playlist) {
      queue.addTrack(result.playlist.tracks);
      title = result.playlist.title;
    } else {
      const track = result.tracks[0];

      queue.addTrack(track);
      title = track.title;
    }

    if (!queue.node.isPlaying()) {
      queue.node.play();
    }

    // Add estimated time until playing
    return await interaction.followUp({
      content: `⏱️ | \`${title}\`.`,
    });
  } catch (e) {
    // let's return error if something failed
    return interaction.followUp(`Something went wrong: ${e}`);
  }
}
