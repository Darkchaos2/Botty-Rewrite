let Command = require("./command.js");

class RoleAdd extends Command {
	constructor(text){
		super("help", "Trys to help :sweat_smile:", ["[command]"], true, false);
	}

	action(params, msg, client) {
		// If no role has been given, remind user how to use command
		if(params.length < 1) {
			msgChannel.send(this.genHelp(msg));
		}
		// If roles are given, try assigning given roles
		else {
			let roleSuccess = [];
			let roleFail = [];
			let roleMissingPerm = [];
			let roleNotFound = [];

			for(const role of params) {
				if(msgMember.roles.findLc("name", role) != null) {
					roleFail[roleFail.length] = role;
				}
				else {
					promises[promises.length] = msgMember.addRole(msg.guild.roles.findLc("name", role))
					.then(function() {
						roleSuccess[roleSuccess.length] = role;
					})
					.catch(function (err) {
						// if the role doesnt exist, alert user
						if(err.name == "TypeError") {
							roleNotFound[roleNotFound.length] = role;
						}
						// if role is of a higher or equivelent rank to botty, alert user
						else if(err.name == "DiscordAPIError") {
							roleMissingPerm[roleMissingPerm.length] = role;
						}
					});
				}
			}

			Promise.all(promises)
			.then(values => {
				if(params.length == 1) {
					msgChannel.send(
						(roleSuccess.length != 0 ? `\`${params[0]}\` assigned to ${msgAuthor}` : "") +
						(roleFail.length != 0 ? `${msgAuthor}, you've already got this role, silly billy :yum:` : "") +
						(roleMissingPerm.length != 0 ? `I'm sorry, ${msgAuthor}. I'm afraid I can't do that.\nPlease contact a member of committee if you wish to be assigned this role.` : "") +
						(roleNotFound.length != 0 ? autocorrect(msgParas, msg.guild.roles, 1, msgAuthor, true) : ""));
						//(roleNotFound.length != 0 ? `${msgAuthor} Cannot find role \`${params[0]}.\`` : ""));
				}
				else {
					msgChannel.send(
						msgAuthor + "\n" +
						(roleSuccess.length != 0 ? toSentence(roleSuccess) + " successfully assigned.\n" : "") +
						(roleFail.length != 0 ? toSentence(roleFail) + (roleFail.length == 1 ? " has" : " have") + " already been assigned. :confused:\n" : "") +
						(roleMissingPerm.length != 0 ? toSentence(roleMissingPerm) + " cannot be assigned. Please contact a member of committee if you wish to be assigned this role.\n" : "") +
						(roleNotFound.length != 0 ? toSentence(roleNotFound) + " cannot be found." : ""));
				}
			});
		}
	}
}

module.exports = RoleAdd;