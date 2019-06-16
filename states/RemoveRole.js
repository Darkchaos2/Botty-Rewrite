const Utils = require('../utils/Utils.js');
const State = require('./State.js');

class RemoveRole extends State {
	constructor() {
		super();
	}

	parseMsgContent(msgContent) {
		msgContent = msgContent.toLowerCase();

		if(msgContent == "y") msgContent = "yes";
		if(msgContent == "yeah") msgContent = "yes";
		if(msgContent == "confirm") msgContent = "yes";
		if(msgContent == "positive") msgContent = "yes";
		if(msgContent == "yee") msgContent = "yes";

		if(msgContent == "n") msgContent = "no";
		if(msgContent == "nah") msgContent = "no";
		if(msgContent == "deny") msgContent = "no";
		if(msgContent == "negative") msgContent = "no";

		return msgContent
	}

	Action(vgsMember, msg, commands, client) {
		msg.content = this.parseMsgContent(msg.content);

		if(msg.content != "yes" && msg.content != "no") {
			vgsMember.Reset();
			return false;
		}

		// if the user has taken too long,
		if(vgsMember.timeoutStatus == 1) {
			// alert user that their request has expired and reset their state to default.
			msg.channel.send(`Request expired, ${msg.author}`);
			vgsMember.Reset();
			return true;
		}

		// if the user confirms auto-correct,
		if(msg.content == "yes") {
			// remove role from user.
			msg.member.removeRole(vgsMember.data)
			// After successful role remove, alert user.
			.then(function() {
				msg.channel.send(`Removed \`${vgsMember.data.name}\` from ${msg.author}`);
			})
			// If error in removing role (e.g. Bot doesn't have perms), then alert user.
			.catch(function (err) {
				msg.channel.send(`I'm sorry, ${msg.author}. I'm afraid I can't do that.\nPlease contact a member of committee if you wish to remove this role.`);
			})
			// After both cases, reset user state.
			.then(function() {
				vgsMember.Reset()
			});
		}
		// if user denies auto-correct,
		else if(msg.content == "no") {
			// alert user and reset user state.
			msg.channel.send(`Did not remove \`${vgsMember.data.name}\`, ${msg.author}`);
			vgsMember.Reset();
		}

		return true;
	}
}

module.exports = RemoveRole;