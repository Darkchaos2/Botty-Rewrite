let Command = require("./command.js");

class Restart extends Command {
	constructor(text){
		super('restart', '"reboots" botty', [], false, true);
	}

	action(params, msg, client) {
		msg.channel.send(`Restarting...`)
		.then(msg => {
			process.exit();
		});
	}
}

module.exports = Restart;
