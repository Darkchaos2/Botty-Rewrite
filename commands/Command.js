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

	genHelp(msg) {
		return `${msg.author}\n**Description**: ${this.desc}\n**Usage**: \`${this.commandName} ${this.params.join(", ")}\``;
	}

	action(params, msg, client) {
		console.log(`${this.commandName} - null action`);
		return false;
	}
}

module.exports = Command;