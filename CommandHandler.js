class CommandHandler {

    /**
     *Creates an instance of CommandHandler.
     * @param {*} [data={}]
     * @memberof CommandHandler
     */

    constructor(data = {}) {

        if (!data.folder) throw new Error("No folder specified.");
        this.folder = data.folder;
        if(!data.prefix) throw new Error("No prefix specified.");
        if (!Array.isArray(data.prefix)) data.prefix = [data.prefix];
        data.prefix.sort((a, b) => a.length < b.length);
        this.prefix = data.prefix;
        this._loadFrom(data.folder)
    }

    _loadFrom(folder) {
        const commands = new Map();
        const aliases = new Map();

        const fs = require("fs");

        const files = fs.readdirSync(folder);
        files.filter(f => fs.statSync(folder + f).isDirectory())
            .forEach(nested => fs.readdirSync(folder + nested).forEach(f => files.push(nested + '/' + f)));
        const jsFiles = files.filter(f => f.endsWith('.js'));

        if (files.length <= 0) throw new Error('No commands to load!');
        const fileAmount = `${jsFiles.length}`;
        console.log(`Found ${fileAmount} files to load!\n`);

        for (const f of jsFiles) {
            const file = require(folder + f);
            const cmd = new file();

            const name = cmd.name;
            commands.set(name, cmd);

            console.log(`Loading command: '${name}'`);
            for (const alias of cmd.alias) {
                aliases.set(alias, name);
            }
        }

        console.log('Done loading commands!');
        this.commands = commands;
        this.aliases = aliases;
    }

    getCommand(string) {
        //Check if the string even exists before we get started.
        if (!string) return null;

        let prefix = '';

        let prefixExists = false;
        //Now to check if the string(the command) starts with any of the prefixes in the prefix array
        //and if it does, set prefix to x and bool to true.
        for (const x of this.prefix) {
            if (string.startsWith(x)) {
                prefix = x;
                prefixExists = true;
                break;
            }
        }
        //obviously if prefix is still false, we wanna stop.
        if (!prefixExists) return null;
        //grab the command without the prefix by getting the prefix length
        const command = string.substring(prefix.length);
        //Check the command set from the _loadFrom function. if it doesn't exist we also check command against aliases then we return the cmd.
        let cmd = this.commands.get(command);
        if (!cmd) {
            const alias = this.aliases.get(command);
            if (!alias) return null;
            cmd = this.commands.get(alias);
        }
        return cmd;
    }
}
module.exports = {
    CommandHandler
};