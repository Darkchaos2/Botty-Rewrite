function roleadd() {
	if(msgParas == "") {
		msgChannel.send(`${msgAuthor}\n**Description**: ${settings.commands.cmdRoleAdd.help.desc}\n**Usage**: \`${settings.commands.cmdRoleAdd.command} ${settings.commands.cmdRoleAdd.help.parameters}\``);
	}
	else {
		msgDecomp = msgParas.split(", ");
		roleSuccess = [];
		roleFail = [];
		roleMissingPerm = [];
		roleNotFound = [];
		for(const i of msgDecomp) {
			if(msgMember.roles.findLc("name", i) != null) {
				roleFail[roleFail.length] = i;
			}
			else {
				promises[promises.length] = msgMember.addRole(msg.guild.roles.findLc("name", i))
				.then(function() {
					roleSuccess[roleSuccess.length] = i;
				})
				.catch(function (err) {
					// if the role doesnt exist, alert user
					if(err.name == "TypeError") {
						roleNotFound[roleNotFound.length] = i;
					}
					// if role is of a higher or equivelent rank to botty, alert user
					else if(err.name == "DiscordAPIError") {
						roleMissingPerm[roleMissingPerm.length] = i;
					}
				});
			}
		}

		Promise.all(promises)
		.then(values => {
			if(msgDecomp.length == 1) {
				msgChannel.send(
					(roleSuccess.length != 0 ? `\`${msgDecomp[0]}\` assigned to ${msgAuthor}` : "") +
					(roleFail.length != 0 ? `${msgAuthor}, you've already got this role, silly billy :yum:` : "") +
					(roleMissingPerm.length != 0 ? `I'm sorry, ${msgAuthor}. I'm afraid I can't do that.\nPlease contact a member of committee if you wish to be assigned this role.` : "") +
					(roleNotFound.length != 0 ? autocorrect(msgParas, msg.guild.roles, 1, msgAuthor, true) : ""));
					//(roleNotFound.length != 0 ? `${msgAuthor} Cannot find role \`${msgDecomp[0]}.\`` : ""));
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