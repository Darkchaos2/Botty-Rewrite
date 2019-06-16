const Utils = require('../utils/Utils.js');
const State = require('./State.js');

class Default extends State {
	constructor() {
		super();
	}

	Action(vgsMember, msg, commands, client) {
		let parsed = Utils.parseCommand(msg.content);
		commands.FindAndRunCommand(parsed, msg, client);
		return true;
	}
}

module.exports = Default;