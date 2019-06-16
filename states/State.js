const Utils = require('../utils/Utils.js');

class State {
	constructor() {
		
	}

	Action(vgsMember, msg, commands, client) {
		console.log('State has no actions');
		return false
	}
}

module.exports = State;