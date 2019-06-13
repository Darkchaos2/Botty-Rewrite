class CommandManager {
	constructor(){
		// this.commands = {};

		this.register(require('./Help.js'));
		this.register(require('./RoleList.js'));
		this.register(require('./RoleAdd.js'));
		this.register(require('./RoleRemove.js'));
		this.register(require('./RoleRemoveAll.js'));
		this.register(require('./Say.js'));
		this.register(require('./Changelog.js'));
		this.register(require('./Report.js'));
		this.register(require('./Init.js'));
	}

	register(command) {
		this[command.name.toLowerCase()] = new command();
	}
}

module.exports = CommandManager