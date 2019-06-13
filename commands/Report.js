const Command = require("./command.js");
const fs = require("fs");

class Report extends Command {
	constructor(text){
		super("report", "Use to report a user. Make sure to include their __username__ and a __detailed description__ of the reason for the report.", ["details"], true, false);
	}

	action(params, msg, client) {
		// If no role has been given, remind user how to use command
		if(params.length < 1) {
			msg.channel.send(this.genHelp(msg));
			return;
		}

		fs.appendFile("logs/reports.txt", msg.author + " - " + msg.author.username + ": " + params.join(", ") + "\n", log => {
			msg.channel.send(`${msg.author} Thank you for your report. It has been logged and we will review it as soon as possible.`);
			msg.guild.channels.get(client.getConfig().GuildDetails.committeeChannelID).send(`__**Report**__\n__Message__:\n\`${params.join(", ")}\`\n__Reported by__:\n${msg.author}`);
		});
	}
}

module.exports = Report;

