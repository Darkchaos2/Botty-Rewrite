class StateManager {
	constructor(){
		this.register('default', require('./Default.js'));
		this.register('removerole', require('./RemoveRole.js'));
		this.register('addrole', require('./AddRole.js'));
	}

	register(stateName, state) {
		this[stateName] = new state();
	}
}

module.exports = StateManager;