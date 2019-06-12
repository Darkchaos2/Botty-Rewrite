let Command = require("./command.js");

class RoleRemoveAll extends Command {
	constructor(text){
		super("roleremoveall", "Removes all game roles from the user.", [], true, false);
	}

	action(params, msg, client) {
		let promises = [];
		msg.channel.startTyping();
		
		for(let role of msg.member.roles.values()) {
			promises.push(msg.member.removeRole(role)
				.then(function() {
				})
				.catch(function () {
				})
			);
		}

		Promise.all(promises)
		.then(values => {
			msg.channel.send(`All game roles removed, ${msg.author}`);
			msg.channel.stopTyping();
		});
	}
}

module.exports = RoleRemoveAll;

