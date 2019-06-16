const Command = require("./command.js");
const fs = require("fs");

class Suggest extends Command {
	constructor(text){
		super("suggest", "Use to suggest a new feature.", ["suggestion"], true, false);
	}

	action(params, msg, client) {
		// If no role has been given, remind user how to use command
		if(params.length < 1) {
			msg.channel.send(this.genHelp(msg));
			return;
		}

		fs.appendFile("logs/suggestions.txt", msg.author + " - " + msg.author.username + ": " + params.join(", ") + "\n", log => {
			msg.channel.send(`${msg.author} Suggestion logged. Thank you for the suggestion. :smile:`);
			msg.guild.channels.get(client.getConfig().GuildDetails.committeeChannelID).send(`__**Suggestion**__\n__Message__:\n\`${params.join(", ")}\`\n__Suggested by__:\n${msg.author}`);
		});
	}
}

module.exports = Suggest;