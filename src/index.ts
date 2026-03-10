import fs from "fs";
import path from "path";
import {
  REST,
  Routes,
  RESTPostAPIApplicationCommandsJSONBody,
  Client,
} from "discord.js";
import { BaseCommand } from "./types/BaseCommand";
import { CommandHandlerOptions } from "./types/CommandHandlerOptions";

export type { BaseCommand, CommandHandlerOptions };

export class CommandHandler {
  private client: Client;
  private token: string;
  private folder: string;
  private updateCommands: boolean;
  private commands: Map<string, BaseCommand> = new Map();

  constructor({
    client,
    token,
    folder,
    updateCommands = true,
  }: CommandHandlerOptions) {
    if (!client || !token || !folder)
      throw new Error("Missing required parameters.");
    this.client = client;
    this.token = token;
    this.folder = path.resolve(folder);
    this.updateCommands = updateCommands;
    this._init();
  }

  private async _init() {
    const jsonCommands = this._loadFiles();

    if (this.updateCommands) {
      this.client.once("ready", async () => {
        await this.deploy(jsonCommands);
      });
    }
  }

  private _loadFiles(): RESTPostAPIApplicationCommandsJSONBody[] {
    const jsonCommands: RESTPostAPIApplicationCommandsJSONBody[] = [];
    const files = this._getFiles(this.folder);

    for (const filePath of files) {
      try {
        const CommandClass = require(filePath).default ?? require(filePath);
        const cmd: BaseCommand = new CommandClass();
        this.commands.set(cmd.name, cmd);

        if (cmd.slashCommand) jsonCommands.push(cmd.slashCommand.toJSON());

        console.log(`✅ Loaded command: ${cmd.name}`);
      } catch (err) {
        console.error(`❌ Failed to load command ${filePath}:`, err);
      }
    }

    return jsonCommands;
  }

  private _getFiles(dir: string): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(dir);

    for (const file of list) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory())
        results = results.concat(this._getFiles(fullPath));
      else if (file.endsWith(".js") || file.endsWith(".ts"))
        results.push(fullPath);
    }

    return results;
  }

  async deploy(jsonCommands: RESTPostAPIApplicationCommandsJSONBody[]) {
    const rest = new REST({ version: "10" }).setToken(this.token);
    try {
      console.log(`Refreshing ${jsonCommands.length} slash commands...`);
      await rest.put(Routes.applicationCommands(this.client.user!.id), {
        body: jsonCommands,
      });
      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error("Error deploying commands:", error);
    }
  }

  getCommand(name: string): BaseCommand | null {
    return this.commands.get(name) ?? null;
  }
}
