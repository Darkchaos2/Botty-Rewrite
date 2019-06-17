const Command = require("./command.js");
const Utils = require('../utils/Utils.js');

class Help extends Command {
	constructor(text){
		super("help", "Trys to help :sweat_smile:", ["[command]"], true, false);
	}

	action(params, msg, client) {
		// If user is asking about a specific command
		if(params.length > 0) {
			if(Object.keys(client.commands).some(label => { return label == params[0] })) {
				let command = client.commands[params[0]];

				msg.channel.send(command.genHelp(msg));
			}
			else {
				msg.channel.send(`Cannot find command \`${params}\`, ${msg.author}`);
			}
		}
		// If user need general help
		else {
			msg.channel.send(Utils.genHelpList(client.commands));
		}
	}
}

module.exports = Help;