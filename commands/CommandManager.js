class CommandManager {
	constructor() {
		this.register(require('./Init.js'));
		this.register(require('./Help.js'));
		this.register(require('./RoleList.js'));
		this.register(require('./RoleAdd.js'));
		this.register(require('./RoleRemove.js'));
		this.register(require('./RoleRemoveAll.js'));
		this.register(require('./Say.js'));
		this.register(require('./Changelog.js'));
		this.register(require('./Report.js'));
		this.register(require('./Suggest.js'));
		this.register(require('./Update.js'));
		this.register(require('./Restart.js'));
	}

	register(command) {
		this[command.name.toLowerCase()] = new command();
	}

	FindAndRunCommand(parsed, msg, client) {
		for(let label in this) {
			let command = this[label];

			if(command.parse(parsed.command, parsed.params, msg, client))
				return;
		}

		msg.channel.send(`${msg.author} Unknown command. Please refer to the instructions or use the \`help\` command.`);
	}
}

module.exports = CommandManager;