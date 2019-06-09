let command = require("./command.js");

class RoleList extends command{
	constructor(text){
		super("rolelist", "Returns a list of all roles", [], true, false);
	}

	parse(parsedCommandName, params, msg, client) {
		if(parsedCommandName == this.commandName){
			console.log("rolelist'ing");
			this.action(params, msg, client);
			return true;
		}
		else {
			console.log("rolelist failed");
			return false;
		}

	}

	action(params, msg, client) {
		msg.channel.send("list roles or somthing");
	}
}

module.exports = RoleList;