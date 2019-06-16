let Command = require("./command.js");

class Update extends Command {
	constructor(text){
		super('update', "Re-reads all local files and updates Botty accoringly.", [], false, true);
	}

	action(params, msg, client) {
		client.LoadConfig();
		client.UpdateDesc(`User request`);
		msg.channel.send(`Updated! ${msg.author}`)
	}
}

module.exports = Update;

