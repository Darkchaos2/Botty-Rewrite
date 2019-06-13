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

	action(params, msg, client) {
		// If no role has been given, remind user how to use command
		if(params.length < 1) {
			msg.channel.send(this.genHelp(msg));
			return;
		}

		// Do something
	}
}

module.exports = NAME;