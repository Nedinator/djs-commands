const { readdir, lstat } = require('fs');
const { resolve } = require('path');

module.exports = (folder, prefixes) => {
  if (!folder) throw new Error("No folder specified.");
  if(!prefixes) throw new Error("No prefix specified.");
  if(!Array.isArray(prefixes)) prefixes = [ prefixes ];
  prefixes.sort((a, b) => b.length - a.length);
  const commands = new Map();

  (async function scan(dir) {
    readdir(dir, (err, files) => {
      if(err) throw err;
      for(const file of files) {
        const path = resolve(dir, file);
        if(file.endsWith('.js')) {
          const command = new (require(path))();
          console.log(`Loading command: '${command.name}'`);
          commands.set(command.name, command);
          for(const alias of command.aliases || []) {
            commands.set(alias, command);
          }
        } else {
          lstat(path, (err, stats) => {
            if(err) throw err;
            if(stats.isDirectory()) scan(path);
          })
        }
      }
    })
  })(folder)

  return message => {
    const prefix = prefixes.find(p => message.content.startsWith(p));
    if(!prefix) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();
    return commands.has(cmd) && commands.get(cmd).run(message.client, message, args);
  }
}
