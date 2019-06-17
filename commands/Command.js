class Command {
	constructor(commandName = undefined, desc = undefined, params = [], commandPublic = false, hidden = true){
		this.commandName = commandName;
		this.desc = desc;
		this.params = params;
		this.commandPublic = commandPublic;
		this.hidden = hidden;

		console.log(`Command loaded: ${commandName}`);
	}

	parse(commandName, params, msg, client) {
		if(commandName == this.commandName){
			if(!this.commandPublic && !msg.member.hasPermission('ADMINISTRATOR')) {
				msg.channel.send(`You do not have permission to use this command, ${msg.author}`);
				console.log(`${this.commandName} - invalid permissions`);
				return false;
			}

			console.log(`${this.commandName}'ing`);
			this.action(params, msg, client);
			return true;
		}

		// console.log(`${this.commandName} failed`);
		return false;
	}

	genHelp(msg) {
		return `${msg.author}\n**Description**: ${this.desc}\n**Usage**: \`${this.commandName} ${this.params.join(" ")}\``;
	}

	action(params, msg, client) {
		msg.channel.send(`There is no action currently assigned to this command, ${msg.author}`);
		console.log(`${this.commandName} - null action`);
		return false;
	}
}

module.exports = Command;