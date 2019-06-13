const Utils = require('../utils/Utils.js');
let command = require('./command.js');

class RoleList extends command{
	constructor(){
		super('rolelist', 'Returns a list of all roles.', [], true, false);
	}

	action(params, msg, client) {
		msg.channel.send(Utils.genRoleList(msg.guild));
	}
}

module.exports = RoleList;