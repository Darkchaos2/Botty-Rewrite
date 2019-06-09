let command = require("./command.js");

class RoleList extends command{
	constructor(text){
		super("rolelist", "Returns a list of all roles", [], true, false);
	}

	action(params, msg, client) {
		msg.channel.send("list roles or somthing");
	}
}

module.exports = RoleList;