const Utils = require('../utils/Utils.js');
const State = require('./State.js');

class AddRole extends State {
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
			if(msg.member.roles.get(vgsMember.data.id)) {
				msg.channel.send(`${msg.author}, you've already got this role, silly billy :yum:`);
			}
			else {
				msg.member.addRole(vgsMember.data)
				.then(function() {
					msg.channel.send(`Assigned \`${vgsMember.data.name}\` to ${msg.author}`);
				})
				.catch(function (err) {
					msg.channel.send(`I'm sorry, ${msg.author}. I'm afraid I can't do that.\nPlease contact a member of committee if you wish to be assigned this role.`);
				})
				.then(function() {
					vgsMember.Reset()
				});
			}
		}
		// if user denies auto-correct,
		else if(msg.content == "no") {
			// alert user and reset user state.
			msg.channel.send(`Did not assign \`${vgsMember.data.name}\`, ${msg.author}`);
			vgsMember.Reset();
		}

		return true;
	}
}

module.exports = AddRole;