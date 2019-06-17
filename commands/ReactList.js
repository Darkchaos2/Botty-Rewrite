const Discord = require('discord.js')
const Command = require('./command.js');

class ReactList extends Command {
	constructor(text){
		super('reactlist', 'Lists all emojis I have access to.', [], true, false);
	}

	action(params, msg, client) {
		let embed = new Discord.RichEmbed({});

		// //embed.setAuthor("Darkbot", "https://cdn.discordapp.com/avatars/352563596229607435/120fc68099fdd828051d67a6f951ec7b.png", undefined);
		embed.setColor(client.GetConfig().Preferences.embedColour);
		embed.setTimestamp();

		embed.setTitle("List of emojis")

		// Get all emojis from all guilds bot is in
		for(let guild of msg.guild.me.client.guilds.values()) {
			// If guild contains no emojis, ignore
			if(!guild.emojis.first())
				continue;

			let emojiLabelList = [""];

			// Generates titles for each emoji and splits them into groups no bigger than 1024 characters
			for(let emoji of guild.emojis.values()) {
				let currentEmojiLabel = `${emoji} - ${emoji.name}\n`

				if(emojiLabelList[emojiLabelList.length - 1].length + currentEmojiLabel.length > 1024) {
					emojiLabelList[emojiLabelList.length] = currentEmojiLabel;
					continue;
				}

				emojiLabelList[emojiLabelList.length - 1] += currentEmojiLabel;
			}

			// Gives each emoji group a title
			for(let emojiLabelIdx in emojiLabelList) {
				let emojiLabel = emojiLabelList[emojiLabelIdx];

				embed.addField(`${guild.name} - Page ${parseInt(emojiLabelIdx) + 1}`, emojiLabel, true);
			}

			embed.addBlankField(false);
		}

		msg.channel.send({embed: embed});
	}
}

module.exports = ReactList;