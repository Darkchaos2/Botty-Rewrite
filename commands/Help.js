let Command = require("./command.js");

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
			let str = "**List of spells**:\n";

			Object.values(client.commands).forEach(command => {
				command.commandPublic && !command.hidden ? str += `- \`${command.commandName} ${command.params.join(" ")}\`\n` : "";
			});

			str += "e.g. roleadd Overwatch, Minecraft";

			msg.channel.send(str);
		}
	}
}

module.exports = Help;