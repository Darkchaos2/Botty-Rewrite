class Util {
	constructor() {
    	throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
    }

    static parseOutPrefix(msg, prefix) {
		if(msg.content.startsWith(prefix)) {
			msg.content = msg.content.substring(prefix.length);
			return true;
		}
		return false;
    }

    // Splits the input string based upon space's and returns the first word seperatly to the rest
	static parseCommand(string) {
		let parsed = {};
		let split = string.split(" ");

		// Command
		parsed["command"] = split[0];

		// Parameters
		split.shift(0);
		parsed["params"] = split;

		return parsed;
	}

	// Takes an array and returns a correctly punctuated list
	static toSentence(ary) {
		var temp = ary.slice(); // copys ary to temp. temp contains its own value, not referencing slice
		if(ary.length == 1) return "`" + ary + "`";
		else {
			var last = temp.pop();
			return "`" + temp.join("`, `") + "` and `" + last + "`";
		}
	}

	// Generates and returns a sorted list of roles in the server specified by settings.js
	static genRoleList(guild) {
		let list = [];
		let string = "**List of roles:**";

		let guildRoles = guild.roles.sort((first, second) => second.calculatedPosition - first.calculatedPosition);
		let highestRole = guild.me.highestRole;

		for(let role of guildRoles.values()) {
			if(role.calculatedPosition == 0) // calculatedPosition == @everyone
				continue; 

			if(role.calculatedPosition < highestRole.calculatedPosition) {
				list.push(role);
			}
		}

		for(let role of list.values()) {
			string += "\n`" + role.name + "`";
		}

		return string;
	}

	static genHelpList(commands) {
		let str = "**List of spells**:\n*[...] = optional parameter*\n";

		Object.values(commands).forEach(command => {
			command.commandPublic && !command.hidden ? str += `- \`${command.commandName} ${command.params.join(" ")}\`\n` : "";
		});

		str += "**Example**: roleadd Overwatch, Minecraft";

		return str;
	}

	// Takes a role name, a collection of roles, a state to change the user to after autocorrect, the author (member) to change the state of and a boolean for wheather the function should return a question string and
	static autocorrect(needle, haystack, vgsMember) {
		// role name to search for, collection of roles
		let roleEdit = "";
		let count = {};
		let countMax = 0;
		let countMaxIndex = 0;
		vgsMember.Reset();

		needle = needle.toLowerCase();

		for(let j = 0; j < haystack.array().length; j++) {
			count[j] = 0;
			roleEdit = haystack.array()[j].name.toLowerCase();
			for(let i = 0; i < needle.length; i++) {
				if(roleEdit.indexOf(needle[i]) != -1) {
					let temp = roleEdit.substring(roleEdit.indexOf(needle[i]) + 1, roleEdit.length);
					roleEdit = roleEdit.substring(0, roleEdit.indexOf(needle[i]));
					roleEdit += temp
					count[j]++
					if(j > 0 && count[j] > countMax) { 
						countMax = count[j];
						countMaxIndex = j ;
					}
				}
			}
		}
		
		if(countMax < 0.8 * haystack.array()[countMaxIndex].name.length)
			countMaxIndex = 0;

		console.log(countMax);
		console.log(0.8 * haystack.array()[countMaxIndex].name.length);

		if(countMaxIndex > 0) 	return haystack.array()[countMaxIndex];
		else 					return null;
	}
}

module.exports = Util;