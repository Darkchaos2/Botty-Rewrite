let Command = require("./command.js");

class React extends Command {
	constructor(text){
		super('react', 'Temporality reacts to the previous message, allowing the user to react', ['Emoji_name'], true, false);
	}

	customParse(params) {
		return params.join(" ");
	}

	FindEmoji(param, msg) {
		// Test if emoji
		let ifEmoji = param.match(/(?<=<a?:.+:)[0-9]*(?=>)/g)
		if(ifEmoji)
			return msg.guild.me.client.emojis.get(ifEmoji[0]);

		// Test if ID
		let ifEmojiID = msg.guild.me.client.emojis.get(param);
		if(ifEmojiID)
			return ifEmojiID;

		// Test if emoji name
		let ifEmojiName = msg.guild.me.client.emojis.find(emoji => emoji.name.toLowerCase() == param.toLowerCase())
		if(ifEmojiName)
			return ifEmojiName;

		return null;
	}

	action(params, msg, client) {
		// If no role has been given, remind user how to use command
		if(params.length < 1) {
			msg.channel.send(this.genHelp(msg));
			return;
		}

		if(!msg.guild.me.hasPermission("ADD_REACTIONS"))
			return msg.channel.send(`I do not have the permissions to add reactions in this channel, ${msg.author}.`);

		params = this.customParse(params);
		let emoji = this.FindEmoji(params, msg);

		if(!emoji)
			return msg.channel.send(`Cannot find emoji \`${params}\`, ${msg.author}.`);

		if(emoji.guild.id != msg.guild.id && !msg.guild.me.hasPermission("USE_EXTERNAL_EMOJIS"))
			return msg.channel.send(`I do not have the permissions to add external reactions in this channel, ${msg.author}.`)

		msg.channel.fetchMessages({limit: 1, before: msg.id})
		.then(msg => {
			msg.first().react(emoji)
			.then(react => {
				setTimeout(function() {
					react.remove()
					.catch(err => {
						console.log(err.message);
					});
				}, client.GetConfig().Preferences.reactLingerTime);
			});
		})
		.catch(err => {
			return msg.channel.send(`Could not fetch message, ${msg.author}.`);
		});
		msg.delete();
		return;
	}
}

module.exports = React;