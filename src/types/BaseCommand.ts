import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export interface BaseCommand {
  name: string;
  description?: string;
  slashCommand: SlashCommandBuilder;

  run(interaction: ChatInputCommandInteraction): Promise<void>;
}
