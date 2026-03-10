import { Client } from "discord.js";

export interface CommandHandlerOptions {
  client: Client;
  token: string;
  folder: string;
  updateCommands?: boolean;
}
