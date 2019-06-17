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