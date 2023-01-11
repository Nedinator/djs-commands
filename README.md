# djs-commands

> an all-in-one command handler package.

[![NPM Version][npm-image]][npm-url]
[![Downloads Stats][npm-downloads]][npm-url]

Djs-commands currently includes a command handler for your Discord.JS bots.

## UPDATE v2.0.0 MAJOR CHANGE

> Hi! So over the years this bot has become more and more deprecated, and with the switch to slash commands, I decided to accommodate for that. This update is mostly for me to continue to use the same handler I've used for years with actual support for the recent changes with Discordjs, but it still remains open source on github with the link below.

### djs-commands Discord Help Server

> I set up a support server, it's minimal for now. I noticed a surge in downloads when I updated and assume many were from the videos and with it being extremely different, figured this would help. Also, any contribution questions/discussions can take place here. [Click here to join](https://discord.gg/s9nwfGqkrk)

## Installation

```sh
npm install djs-commands discord.js @discordjs/builders dotenv
```

## Setup guide

1 - Setup `.env` in the root folder of the bot

```env
CLIENT_ID=CLIENTIDHERE
GUILD_ID=CLIENTIDHERE
TOKEN=BOTTOKENHERE
```

2 - Require and create a CommandHandler instance

```js
const { CommandHandler } = require('djs-commands');
const CH = new CommandHandler({
	folder: __dirname + '/commands/',
	globalCommandRefresh: true, //not including this or setting as false reverts to not updating commands.
});
```

Another option is to use `guildCommandRefresh: true` to just refresh guild commands from the ID in `.env`.

3 - In the interactionCreate event is where we will run our command

```js
client.on('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	let cmd = CH.getCommand(interaction.commandName);
	if (!cmd) return;
	try {
		cmd.run(interaction);
	} catch (e) {
		console.log(e);
	}
});
```

4 - And of course we're going to need a command file. So inside of your bot folder, create a folder called commands. I'm going to create a file called
test.js and put the following code inside of it.

The `this.slashCommand` option takes a `SlashCommandBuilder()` passed as a JSON type. You can add whatever slash command options you like here using [`@discordjs/builders`](https://discord.js.org/#/docs/builders/main/class/SlashCommandBuilder).

```js
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = class test {
	constructor() {
		(this.name = 'test'),
			(this.slashCommand = new SlashCommandBuilder()
				.setName('test')
				.setDescription('A command to test stuff and things.')
				.toJSON());
	}

	async run(interaction) {
		await interaction.reply(this.name + ' works');
	}
};
```

5 - And that's it! You have a working command handler now for all the commands you could want! Here's an example of how to add options to a slash command.

```js
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = class another {
	constructor() {
		(this.name = 'another'),
			(this.slashCommand = new SlashCommandBuilder()
				.setName('another')
				.setDescription('Another command to test stuff and things.')
				.addBooleanOption((option) =>
					option
						.setName('stuff')
						.setDescription('a description')
						.setRequired(true)
				)
				.toJSON());
	}

	async run(interaction) {
		await interaction.reply(this.name + ' works');
	}
};
```

And then from there, you can add as many options or whatever type of option you wish using the link above.

[https://github.com/nedinator/djs-commands](https://github.com/nedinator/djs-commands)

## Contributing

1. Fork it (<https://github.com/nedinator/djs-commands/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

<!-- Markdown link & img dfn's -->

[npm-image]: https://img.shields.io/npm/v/djs-commands.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/djs-commands
[npm-downloads]: https://img.shields.io/npm/dt/djs-commands.svg?style=flat-square
[discord-image]: https://img.shields.io/discord/265499275088232448.svg?style=flat-square
