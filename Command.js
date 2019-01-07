class Command {
    constructor(data = {}){
        this.name = data.name;
        this.alias = data.alias;
        this.usage = data.usage;
        this.group = data.group;
    }
}
module.exports = {
    Command
}