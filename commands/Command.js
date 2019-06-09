class Command {
	constructor(commandName = undefined, desc = undefined, params = [], commandPublic = false, hidden = true){
		this.commandName = commandName;
		this.desc = desc;
		this.params = params;
		this.commandPublic = commandPublic;
		this.hidden = hidden;
	}

	parse(commandName, params, msg, client) {
		if(commandName == this.commandName){
			console.log(`${this.commandName}'ing`);
			this.action(params, msg, client);
			return true;
		}
		else {
			console.log(`${this.commandName} failed`);
			return false;
		}
	}

	genHelp(msg, cmd, desc, parameters) {
		return `${msg.author}\n
			**Description**: ${desc}\n
			**Usage**: \`${cmd} ${parameters}\``;
	}

	action(msg) {
		console.log(`${this.commandName} - null action`);
		return false;
	}
}

module.exports = Command;