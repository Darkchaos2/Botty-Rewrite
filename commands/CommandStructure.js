let Command = require("./command.js");

class NAME extends Command {
	constructor(text){
		super(COMMANDNAME, DESCRIPTION, [PARAM1, PARAM2], PUBLIC, HIDDEN);
	}

	parse(commandName, params, msg, client) {
		super()
	}

	genHelp(msg, cmd, desc, parameters) {
		super()
	}

	action(msg) {
		// Do something
	}
}

module.exports = NAME;