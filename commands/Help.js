let command = require("./command.js");

class Help extends command{
	constructor(text){
		super("help", "Trys to help :sweat_smile:", ["[command]"], true, false);
	}

	parse(parsedCommandName, params, msg, client) {
		if(parsedCommandName == this.commandName){
			console.log("help'ing");
			this.action(params, msg, client);
			return true;
		}
		else {
			console.log("help failed");
			return false;
		}
	}

	action(params, msg, client) {
		// If user is asking about a specific command
		if(params.length > 0) {
			if(Object.keys(client.commands).some(label => { return label == params[0] })) {
				command = client.commands[params[0]];

				msg.channel.send(`${msg.author}\n**Description**: ${command.desc}\n**Usage**: \`${command.commandName} ${command.params}\``);
			}
			else {
				msg.channel.send(`Cannot find command \`${params}\`, ${msg.author}`);
			}
		}
		// If user need general help
		else {
			let str = "**List of spells**:\n";

			Object.values(client.commands).forEach(command => {
				command.commandPublic && !command.hidden ? str += `- \`${command.commandName} ${command.params.join(", ")}\`\n` : "";
			});

			str += "e.g. roleadd Overwatch, Minecraft";

			msg.channel.send(str);
		}
	}
}

module.exports = Help;