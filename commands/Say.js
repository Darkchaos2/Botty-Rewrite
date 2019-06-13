let Command = require("./command.js");

class Say extends Command {
	constructor(text){
		super("say", "Repeats what ever you say as Botty.", [], false, true);
	}

	action(params, msg, client) {
		// If no role has been given, remind user how to use command
		if(params.length < 1) {
			msg.channel.send(this.genHelp(msg));
			return;
		}

		msg.channel.send(params.join(", "))
		.then(response => {
			if(msg.channel.id == client.GetConfig().GuildDetails.botChannelID)
				client.SaveMessage(response.id);
		});

		msg.delete();
	}
}

module.exports = Say;

