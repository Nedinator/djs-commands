class CommandHandler {
	/**
	 *Creates an instance of CommandHandler.
	 * @param {*} [data={}]
	 * @memberof CommandHandler
	 */

	constructor(data = {}) {
		if (!data.folder) throw new Error('No folder specified.');
		this.folder = data.folder;
		this._loadFrom(data.folder);
	}

	async _loadFrom(folder) {
		const commands = new Map();

		const fs = require('fs');

		const files = fs.readdirSync(folder);
		files
			.filter((f) => fs.statSync(folder + f).isDirectory())
			.forEach((nested) =>
				fs
					.readdirSync(folder + nested)
					.forEach((f) => files.push(nested + '/' + f))
			);
		const jsFiles = files.filter((f) => f.endsWith('.js'));

		if (files.length <= 0) throw new Error('No commands to load!');
		const fileAmount = `${jsFiles.length}`;
		console.log(`Found ${fileAmount} files to load!\n`);
		let jsonCommands = [];
		for (const f of jsFiles) {
			const file = require(folder + f);
			const cmd = new file();

			const name = cmd.name;
			commands.set(name, cmd);
			jsonCommands = jsonCommands.concat(cmd.slashCommand);
			console.log(`Loaded command: '${name}'`);
		}

		console.log('Done loading commands!');
		this.commands = commands;

		const { REST, Routes } = require('discord.js');

		require('dotenv').config();
		const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

		try {
			console.log('Started refreshing application (/) commands.');
			await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
				body: jsonCommands,
			});
		} catch (err) {
			console.log(err);
		}
	}

	getCommand(string) {
		//Check if the string even exists before we get started.
		if (!string) return null;

		//Using the string from the interaction, get the cmd from the commands set and return if not null
		let cmd = this.commands.get(string);
		if (!cmd) return null;
		return cmd;
	}
}

module.exports = {
	CommandHandler,
};
