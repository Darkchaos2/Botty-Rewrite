const Discord = require('discord.js');

const botDetails = require('./settings/botDetails.js');
const CommandManager = require('./commands/CommandManager.js');
const Util = require('./util/Util.js');

const client = new Discord.Client();

class Botv2 {
	constructor() {
		// this.commands = new CommandManager().commands;
		this.commands = new CommandManager();

		client.on('ready', () => {
			console.log("ready");
		});

		client.on('message', msg => {
			// Ignore messages by bots
			if(msg.author.bot)
				return;

			let parsed = Util.parseCommand(msg.content);

			for(var label in this.commands) {
				let command = this.commands[label];

				if(command.parse(parsed.command, parsed.params, msg, this)) {
					break;
				}
			}
		});

		this.login();
	}

	login() {
		// login bot
		client.login(botDetails.botToken)
		.catch(() => {
			console.log("Could not connect");
		});
	}
}

let bot = new Botv2();