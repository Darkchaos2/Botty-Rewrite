const Utils = require('../utils/Utils.js');
let Command = require("./command.js");

class RoleEdit extends Command {
	// If user only gave one role, give a more detailed response
	genSingleResponse(succ, fail, missPerm, notFound, msg, client) {
		return (
			(succ.length != 0 ? `\`${succ[0]}\` assigned to ${msg.author}` : "") +
			(fail.length != 0 ? `${msg.author}, you've already got this role, silly billy :yum:` : "") +
			(missPerm.length != 0 ? `I'm sorry, ${msg.author}. I'm afraid I can't do that.\nPlease contact a member of committee if you wish to be assigned this role.` : "") +
			(notFound.length != 0 ? Utils.autocorrect(notFound[0], msg.guild.roles, 1, msg.author, true) : ""));
	}

	// If user gave more than one role, be more consice in the reponse
	genCompressedResponse(succ, fail, missPerm, notFound, msg, client) {
		return (
			msg.author + "\n" +
			(succ.length != 0 ? Utils.toSentence(succ) + " successfully assigned.\n" : "") +
			(fail.length != 0 ? Utils.toSentence(fail) + (fail.length == 1 ? " has" : " have") + " already been assigned. :confused:\n" : "") +
			(missPerm.length != 0 ? Utils.toSentence(missPerm) + " cannot be assigned. Please contact a member of committee if you wish to be assigned this role.\n" : "") +
			(notFound.length != 0 ? Utils.toSentence(notFound) + " cannot be found." : ""));
	}
}

module.exports = RoleEdit;