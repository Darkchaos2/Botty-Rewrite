let Command = require("./command.js");

class Init extends Command {
	constructor(text){
		super('init', 'Starts Botty in this channel.', [], false, true);
	}

	action(params, msg, client) {
		msg.channel.startTyping();

		client.sendDesc(msg.channel)
		.then(response => {
			client.SetBotChannel(response.channel.id);
			client.SetStartMessage(response.id);
			client.SaveConfig();
			msg.channel.stopTyping();
		});

	}
}

module.exports = Init;