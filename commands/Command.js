class Command {
    constructor(commandName = "undefined", desc = "undefined", params = [], commandPublic = false, hidden = true){
       this.commandName = commandName;
       this.desc = desc;
       this.params = params;
       this.commandPublic = commandPublic;
       this.hidden = hidden;
    }

    parse(commandName, params, msg, client) {
    	console.log(this.name + " - null attempt");
    	return false;
    }

    action(msg) {
    	console.log(this.name + " - null action");
    	return false;
    }

	genHelp(msg, cmd, desc, parameters) {
		return `${msg.author}\n
			**Description**: ${desc}\n
			**Usage**: \`${cmd} ${parameters}\``;
	}
}

module.exports = Command;