const Utils = require('../utils/Utils.js');
let Command = require("./command.js");

class RoleRemove extends Command {
	constructor(text){
		super("roleremove", "Removes a game role(s) to your user.", ["role1", "[, role2[, role3[, ...]]]"], true, false);
	}

	customParse(params) {
		return params.join(" ").split(", ").filter(x => x != "");
	}

	action(params, msg, client) {
		// If no role has been given, remind user how to use command
		if(params.length < 1) {
			msg.channel.send(this.genHelp(msg));
			return;
		}

		params = this.customParse(params);

		// If roles are given, try removing given roles
		let promises = [];
		// member.removeRole promise returns
		// success 			success
		// not there	 	idk
		// not a role 		idk
		// permissions 		DiscordAPIError: Missing Permissions
		let roleSuccess = [];
		let roleFail = [];
		let roleMissingPerm = [];
		let roleNotFound = [];

		// chose not to use member.addRoles as member.addRole is more flexible and will assign roles even if one fails
		for(const role of params) {
			let searchedRole = msg.guild.roles.find(val => val.name.toLowerCase() == role.toLowerCase());

			// Could not find role
			if(!searchedRole) {
				roleNotFound[roleNotFound.length] = role;
				continue;
			}

			// Member does not have the role to remove
			if(!msg.member.roles.get(searchedRole.id)) {
				roleFail[roleFail.length] = searchedRole.name;
				continue;
			}

			// Try to remove role from member
			promises[promises.length] = msg.member.removeRole(searchedRole)
			.then(function() {
				roleSuccess[roleSuccess.length] = searchedRole.name;
			})
			.catch(function (err) {
				// Role doesnt exist. Moved above member role search as computer dont like null.id :(
				// if(err.name == "TypeError") {}

				// Role is of a higher or equivelent rank to botty
				if(err.name == "DiscordAPIError") {
					roleMissingPerm[roleMissingPerm.length] = searchedRole.name;
				}
			});
		}

		Promise.all(promises)
		.then(values => {
			// If user only gave one role, give a more detailed response
			if(params.length == 1) {
				msg.channel.send(this.genSingleResponse(roleSuccess, roleFail, roleMissingPerm, roleNotFound, msg, client));
			}
			// If user gave more than one role, be more consice in the reponse
			else {
				msg.channel.send(this.genCompressedResponse(roleSuccess, roleFail, roleMissingPerm, roleNotFound, msg, client));
			}
		});
	}

	genSingleResponse(succ, fail, missPerm, notFound, msg, client) {
		let autoCorrectedRole = null;

		if(notFound.length > 0) {
			autoCorrectedRole = Utils.autocorrect(notFound[0], msg.guild.roles, 1, msg.author);
		}

		return (
			(succ.length != 0 ? `\`${succ[0]}\` removed from ${msg.author}` : "") +
			(fail.length != 0 ? `\`${fail[0]}\` cannot be removed as you do not have this role, ${msg.author}` : "") +
			(missPerm.length != 0 ? `I'm sorry, ${msg.author}. I'm afraid I can't do that.\nPlease contact a member of committee if you wish to remove this role.` : "") +
			(notFound.length != 0 ? (autoCorrectedRole != null ? `(Remove) Did you mean \`${autoCorrectedRole.name}\`, ${msg.author}?` : `Cannot find the role \`${notFound[0]}\`, ${msg.author}`) : "")
		);
	}

	genCompressedResponse(succ, fail, missPerm, notFound, msg, client) {
		return (
			msg.author + "\n" +
			(succ.length != 0 ? Utils.toSentence(succ) + " successfully removed.\n" : "") +
			(fail.length != 0 ? Utils.toSentence(fail) + (fail.length == 1 ? " has" : " have") + " already been removed. :confused:\n" : "") +
			(missPerm.length != 0 ? Utils.toSentence(missPerm) + " cannot be removed. Please contact a member of committee if you wish to remove this role.\n" : "") +
			(notFound.length != 0 ? Utils.toSentence(notFound) + " cannot be found." : ""))
	}
}

module.exports = RoleRemove;