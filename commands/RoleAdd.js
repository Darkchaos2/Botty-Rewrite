const Command = require("./command.js");
const Utils = require('../utils/Utils.js');

class RoleAdd extends Command {
	constructor(text){
		super("roleadd", "Assigns a game role(s) to your user.", ["role1", "[, role2[, role3[, ...]]]"], true, false);
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

		// If roles are given, try assigning given roles
		let promises = [];
		// member.addRole promise returns
		// success 			success
		// already there 	success
		// not a role 		TypeError
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

			// Member already has role
			if(msg.member.roles.get(searchedRole.id)) {
				roleFail[roleFail.length] = searchedRole.name;
				continue;
			}

			// Try to add role to member
			promises[promises.length] = msg.member.addRole(searchedRole)
			.then(function() {
				roleSuccess[roleSuccess.length] = searchedRole.name;
			})
			.catch(function (err) {
				// if the role doesnt exist, alert user. Moved above member role search as computer dont like null.id :(
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
			(succ.length != 0 ? `\`${succ[0]}\` assigned to ${msg.author}` : "") +
			(fail.length != 0 ? `${msg.author}, you've already got this role, silly billy :yum:` : "") +
			(missPerm.length != 0 ? `I'm sorry, ${msg.author}. I'm afraid I can't do that.\nPlease contact a member of committee if you wish to be assigned this role.` : "") +
			(notFound.length != 0 ? (autoCorrectedRole != null ? `(Assign) Did you mean \`${autoCorrectedRole.name}\`, ${msg.author}?` : `Cannot find \`${notFound[0]}\`, ${msg.author}`) : "")
		);
	}

	genCompressedResponse(succ, fail, missPerm, notFound, msg, client) {
		return (
			msg.author + "\n" +
			(succ.length != 0 ? Utils.toSentence(succ) + " successfully assigned.\n" : "") +
			(fail.length != 0 ? Utils.toSentence(fail) + (fail.length == 1 ? " has" : " have") + " already been assigned. :confused:\n" : "") +
			(missPerm.length != 0 ? Utils.toSentence(missPerm) + " cannot be assigned. Please contact a member of committee if you wish to be assigned this role.\n" : "") +
			(notFound.length != 0 ? Utils.toSentence(notFound) + " cannot be found." : "")
		);
	}
}

module.exports = RoleAdd;