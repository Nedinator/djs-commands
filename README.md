# djs-commands

an all-in-one command handler package.

[![NPM Version][npm-image]][npm-url]
[![Downloads Stats][npm-downloads]][npm-url]

### 3.1.0 Notice

> I've added typescript support, and it currently works just the same with vanilla discord.js. Only example I have going for a Typescript bot is [https://github.com/nedinator/MMOCord](https://github.com/nedinator/MMOCord)

## Installation

```sh
npm install djs-commands
```

## Setup guide

1 - Require and create a CommandHandler instance

> Pass through the Discord Client instantiated from Discord.js, your token (this may be optional in the future but is needed to register slash commands), and the folder path that houses your command files.

```js
const { CommandHandler } = require("djs-commands");
const handler = new CommandHandler({ client, token, folder_path });
```

2 - In the interactionCreate event is where we will run our command

```js
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  let cmd = handler.getCommand(interaction.commandName);
  if (!cmd) return;
  try {
    cmd.run(interaction);
  } catch (e) {
    console.log(e);
  }
});
```

3 - And of course we're going to need a command file. So inside of your bot folder, create a folder called commands. I'm going to create a file called
test.js and put the following code inside of it.

The `this.slashCommand` option takes a `SlashCommandBuilder()` passed as a JSON type. You can add whatever slash command options you like here using [`discordjs/builders`](https://discord.js.org/docs/packages/discord.js/14.25.1/SlashCommandBuilder:Class).

```js
const { SlashCommandBuilder } = require("discordjs");
module.exports = class test {
  constructor() {
    ((this.name = "test"),
      (this.slashCommand = new SlashCommandBuilder()
        .setName("test")
        .setDescription("A command to test stuff and things.")));
  }

  async run(interaction) {
    await interaction.reply(this.name + " works");
  }
};
```

4 - And that's it! You have a working command handler now for all the commands you could want! Here's an example of how to add options to a slash command.

```js
const { SlashCommandBuilder } = require("discordjs");
module.exports = class another {
  constructor() {
    ((this.name = "another"),
      (this.slashCommand = new SlashCommandBuilder()
        .setName("another")
        .setDescription("Another command to test stuff and things.")
        .addBooleanOption((option) =>
          option
            .setName("stuff")
            .setDescription("a description")
            .setRequired(true),
        )));
  }

  async run(interaction) {
    await interaction.reply(this.name + " works");
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
