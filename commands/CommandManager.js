const Utils = require('../utils/Utils.js');

class CommandManager {
	constructor() {
		this.register(require('./Init.js'));
		this.register(require('./Help.js'));
		this.register(require('./RoleList.js'));
		this.register(require('./RoleAdd.js'));
		this.register(require('./RoleRemove.js'));
		this.register(require('./RoleRemoveAll.js'));
		this.register(require('./Say.js'));
		this.register(require('./Changelog.js'));
		this.register(require('./Report.js'));
		this.register(require('./Suggest.js'));
		this.register(require('./Update.js'));
		this.register(require('./Restart.js'));
		this.register(require('./React.js'));
		this.register(require('./ReactList.js'));
		this.register(require('./Meme.js'));
	}

	register(command) {
		this[command.name.toLowerCase()] = new command();
	}

	FindAndRunCommand(parsed, msg, client) {
		for(let label in this) {
			let command = this[label];

			if(command.parse(parsed.command, parsed.params, msg, client))
				return;
		}

		let memberRole = msg.member.roles.find(role => role.name == msg.content)
		if(memberRole) {
			msg.member.removeRole(memberRole)
			.then(guildMember => {
				msg.channel.send(`Removed \`${msg.content}\` from ${msg.author}`)
			})
			.catch(err => {
				msg.channel.send(`I'm sorry, ${msg.author}. I'm afraid I can't do that.\nPlease contact a member of committee if you wish to be assigned this role.`);
			});

			return;
		}
		
		let guildRole = msg.guild.roles.find(role => role.name == msg.content)
		if(guildRole) {
			msg.member.addRole(guildRole)
			.then(guildMember => {
				msg.channel.send(`Assigned \`${msg.content}\` to ${msg.author}`);
			})
			.catch(err => {
				msg.channel.send(`I'm sorry, ${msg.author}. I'm afraid I can't do that.\nPlease contact a member of committee if you wish this role to be removed.`);
			});

			return;
		}

		let guildRoleAutoCorrect = Utils.autocorrect(msg.content, msg.member.roles, client.userStates[msg.author.id]);
		if(guildRoleAutoCorrect) {
			msg.channel.send(`(Remove) Did you mean \`${guildRoleAutoCorrect.name}\`, ${msg.author}?`);
			client.userStates[msg.author.id].ChangeState('removerole', guildRoleAutoCorrect);

			return;
		}

		let memberRoleAutoCorrect = Utils.autocorrect(msg.content, msg.member.roles, client.userStates[msg.author.id]);
		if(memberRoleAutoCorrect) {
			msg.channel.send(`(Remove) Did you mean \`${memberRoleAutoCorrect.name}\`, ${msg.author}?`);
			client.userStates[msg.author.id].ChangeState('removerole', memberRoleAutoCorrect);

			return;
		}

		msg.channel.send(`${msg.author} Unknown command. Please refer to the instructions or use the \`help\` command.`);
	}
}

module.exports = CommandManager;