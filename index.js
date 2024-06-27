const fs = require("fs");
const path = require('path');
const { REST, Routes } = require("discord.js");

class CommandHandler {
  /**
   *Creates an instance of CommandHandler.
   * @param {*} [data={}]
   * @memberof CommandHandler
   */

  constructor(data = {}) {
    if (!data.folder) throw new Error("No folder specified.");

    this.folder = data.folder;
    this.guildCommandRefresh = !!data.guildCommandRefresh;

    this._loadFrom(data.folder);
  }

  async _loadFrom(folder) {
    const commands = new Map();

    const files = this._getAllFiles(folder);
    const jsFiles = files.filter((f) => f.endsWith(".js"));

    if (files.length <= 0) throw new Error("No commands to load!");

    console.log(`Found ${jsFiles.length} files to load!\n`);
    let jsonCommands = [];
    for (const f of jsFiles) {
      const file = require(path.join(folder, f));
      const cmd = new file();

      const name = cmd.name;
      commands.set(name, cmd);
      jsonCommands = jsonCommands.concat(cmd.slashCommand.toJSON());
      console.log(`Loaded command: '${name}'`);
    }

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    this.commands = commands;
    if (this.guildCommandRefresh === true) {
      await this.registerGuildCommands(jsonCommands, rest, Routes);
    }
    await this.registerCommands(jsonCommands, rest, Routes);
    console.log("Done loading commands!");
  }

  _getAllFiles(dir) {
    let results = [];

    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      file = path.join(dir, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(this._getAllFiles(file));
      } else {
        results.push(file);
      }
    });

    return results;
  }

  async registerGuildCommands(jsonCommands, rest, Routes) {
    try {
      console.log("Started refreshing GUILD application (/) commands");
      await rest
        .put(
          Routes.applicationGuildCommands(
            process.env.CLIENT_ID,
            process.env.GUILD_ID
          ),
          {
            body: jsonCommands,
          }
        )
        .then(() => console.log("Successfully refreshed guild (/) commands."))
        .catch(console.error);
    } catch (err) {
      console.log(err);
    }
  };

  async registerCommands(jsonCommands, rest, Routes) {
    try {
      console.log("Started refreshing application (/) commands.");
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: jsonCommands,
      });
    } catch (err) {
      console.log(err);
    }
  };

  getCommand = (string) => {
    if (!string) return null;
      return this.commands.get(string) || null;
  };
}

module.exports = {
  CommandHandler,
};
