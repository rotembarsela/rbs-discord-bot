import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("embed")
  .setDescription("Sends an embed");

export async function execute(interaction: CommandInteraction) {
  return interaction.reply("Embed");
}
