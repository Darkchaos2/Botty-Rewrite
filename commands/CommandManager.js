class CommandManager {
	constructor(){
		// this.commands = {};

		this.register(require('./Help.js'));
		this.register(require('./RoleList.js'));
		this.register(require('./RoleAdd.js'));
	}

	register(command) {
		this[command.name.toLowerCase()] = new command();
	}
}

module.exports = CommandManager