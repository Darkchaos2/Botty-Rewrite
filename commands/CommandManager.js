class CommandManager {
	constructor(){
		// this.commands = {};

		this.register(require("./Help.js"));
		this.register(require("./RoleList.js"));
	}

	register(command) {
		// this.commands[command.name] = new command();
		this[command.name.toLowerCase()] = new command();
	}
}

module.exports = CommandManager