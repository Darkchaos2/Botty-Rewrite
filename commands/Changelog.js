const changelog = require('../logs/change log.js');

let Command = require("./command.js");

class ChangeLog extends Command {
	constructor(text){
		super("changelog", "Lists changes made to Botty.", ["[index / version]", "[-all]"], true, false);
	}

	action(params, msg, client) {
		let all = false;
		let index = changelog.changes.length - 1;

		// Parses and removes the all modifier
		if(params.indexOf("-all") > -1) {
			params = params.filter(param => { param != "-all" });
			all = true;
		}

		// Use user input, if given
		if(params.length > 0)
			index = params[0];

		// If parameter is an index, find log for that index
		if(changelog.changes[index]) {
			msg.channel.send(this.genChangeLog(changelog.changes[index], all));
		}
		// If parameter is a version number, find log for that version
		else if(changelog.changes.find(log => {return log.version == index})) {
			msg.channel.send(this.genChangeLog(changelog.changes.find(log => {return log.version == index}), all));
		}
		else {
			msg.channel.send(`Cannot find change log: ${index}`);
		}
	}

	genChangeLog(log, all) {
		let str = "";

		for(let prop in log) {
			if(prop == "bugs" && all == false) continue;

			str += "**" + prop + "**" + ": ";

			if(Array.isArray(log[prop])) {
				for(let j = 0; j < log[prop].length; j++) {
					str += "\n    " + log[prop][j] + (j != log[prop].length - 1 ? "," : "");
				}
			}
			else {
				str += log[prop];
			}

			str += "\n"
		}
		return str;
	}
}

module.exports = ChangeLog;
