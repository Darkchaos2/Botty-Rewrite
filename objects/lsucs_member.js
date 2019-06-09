function Lsucs(id, username, state, data) {
	var thislsucs = this;
	thislsucs.id = id;
	thislsucs.username = username;
	thislsucs.state = state;
	thislsucs.data = data;
	thislsucs.timeoutStatus = 0;
	thislsucs.requestTimeout = 0;

	thislsucs.reset = function() {
		thislsucs.state = 0;
		thislsucs.data = null;
		thislsucs.timeoutStatus = 0;
	}
	thislsucs.timeout = function() {
		thislsucs.requestTimeout = setTimeout(function() {thislsucs.timeoutStatus = 1; console.log("expired");}, 60000);
	}
}

Discord.Collection.prototype.findLc = function(propOrFn, value) {
	for(const prop of this.values()) {
		prop.name = prop.name.toLowerCase();
	}
	return this.find(propOrFn, value.toLowerCase());
}