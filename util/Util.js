class Util {
	constructor() {
    	throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
    }

    // Splits the input string based upon space's and returns the first word seperatly to the rest
	static parseCommand(string) {
		let parsed = {};
		let split = string.split(" ");

		parsed["command"] = split[0];
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
	// Takes an array and returns a bubble sorted array
	static sortArray(array) {
		for (var i = 0; i < array.length; i++) {
			for (var j = 0; j < (array.length - i - 1); j++) {
				if(array[j].toLowerCase() > array[j + 1].toLowerCase()) {
					var tmp = array[j];
					array[j] = array[j + 1];
					array[j + 1] = tmp;
				}
			}        
		}
		return array;
	}

	// Generates and returns a sorted list of roles in the server specified by settings.js
	static genRoleList() {
		list = [];
		string = "**List of roles:**";
		maxCalcRole = 0;

		for(const role of client.guilds.get(settings.guildID).me.roles.values()) {
			if(maxCalcRole < role.calculatedPosition) maxCalcRole = role.calculatedPosition;
		}

		for(i = 1; i < client.guilds.get(settings.guildID).roles.array().length; i++) { // starts at 1 to remove the @everyone role. Discord has changed, reordering the roles so ive change it to a 0 now.
			if((client.guilds.get(settings.guildID).roles.array()[i].calculatedPosition < maxCalcRole) && client.guilds.get(settings.guildID).roles.array()[i].calculatedPosition != 0) { // calculatedPosition == @everyone
				list[list.length] = client.guilds.get(settings.guildID).roles.array()[i].name;
				//string += "\n`" + client.guilds.get(settings.guildID).roles.array()[i].name + "`";
			}
		}
		list = sortArray(list);
		for(var i = 0; i < list.length; i++) {
			string += "\n`" + list[i] + "`";
		}
		return string;
	}
	// Generates and returns a help list of all public and non-hidden commands found in settings.js 
	static genHelpList() {
	}
	// Takes a reason for updating, updates the bot description in the bot channel then logs the reason for updating
	static updateDesc(reason) {
		client.channels.get(settings.botChannelIDs[0]).fetchMessage(settings.descriptionMessageID)
		.then(message => message.edit(eval("`" + settings.botDescription + "`")))
		.then(msg => fs.appendFile("logs/log.txt", `Botty Description Updated - ${reason}\n`, log => console.log(`Botty Description Updated: ${reason}`)))
		.catch(console.error);
	}
	// Unfinished function
	// The plan was to have a description of each game so when a user only enters the role (game), it will send the description and ask if the user would want it assigned.
	// This has been replaced by just assigning the role to the user
	static createGameDesc(role) {
		str = "";
		/*for(var game in settings.games) {
			if (role == settings.games[game].name) {
				str = `${settings.games[game].desc}\n`;
				break;
			}
		}*/
		return(``);
	}
	// Takes a log (array) from the changelog.js file and a boolean for if all bugs should be listed and returns the log in a Discord/user freindly format
	static changelogdisplay(log, all) {
		str = "";
		for(var prop in log) {
			if((prop == "bugs" && all == false) || prop == "isNotPublic") continue;
			str += "**" + prop + "**" + ": ";
			if(Array.isArray(log[prop])) {
				for(j = 0; j < log[prop].length; j++) {
					str += "\n    " + log[prop][j] + (j != log[prop].length - 1 ? "," : "");
				}
			}
			else {
				str += log[prop];
			}
			str += "\n"
		}
		return msgChannel.send(str);
	}

	// Takes a role name, a collection of roles, a state to change the user to after autocorrect, the author (member) to change the state of and a boolean for wheather the function should return a question string and
	static autocorrect(needle, haystack, poststate, author, returnString) {
		// role name to search for, collection of roles, state to change to after autocorrect, autor to change state of, if function shoudl return role or question containing role
		roleEdit = "";
		count = [];
		countMax = 0;
		countMaxIndex = 0;
		needle = needle.toLowerCase();
		states.find(e => {return e.id == author.id}).reset(); 

		for(j = 0; j < haystack.array().length; j++) {
			count[j] = 0;
			roleEdit = haystack.array()[j].name.toLowerCase();
			for(i = 0; i < needle.length; i++) {
				if(roleEdit.indexOf(needle[i]) != -1) {
					temp = roleEdit.substring(roleEdit.indexOf(needle[i]) + 1, roleEdit.length);
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

		/*for(j = 0; j < haystack.array().length; j++) {
			console.log(haystack.array()[j].name + " - " + count[j])
		}*/
		
		countMax < 0.8 * haystack.array()[countMaxIndex].name.length ? countMaxIndex = 0 : "";
		console.log(countMax);
		console.log(0.8 * haystack.array()[countMaxIndex].name.length);

		if(returnString) {
			if(countMaxIndex > 0) {
				changeState(poststate, haystack.array()[countMaxIndex], author);
				return(`(${poststate == 1 ? "Assign" : (poststate == 2 ? "Remove" : "")}) Did you mean: \`${haystack.array()[countMaxIndex].name}\`, ${author}? (yes/no)`);
			}
			else return(`Cannot find \`${needle}\`, ${author}`);
		}
		else {
			if(countMaxIndex > 0) return(haystack.array()[countMaxIndex]);
			else return(null)
		}
	}
}

module.exports = Util;