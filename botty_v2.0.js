const Discord = require('discord.js');

const botDetails = require('./settings/botDetails.js');
const CommandManager = require('./commands/CommandManager.js');
const Utils = require('./utils/Utils.js');

const client = new Discord.Client();

/* Discord.js colletion method overloads */
Discord.Collection.prototype.findLc = function(propOrFn, value) {
	for(const prop of this.values()) {
		prop.name = prop.name.toLowerCase();
	}
	return this.find(propOrFn, value.toLowerCase());
}

class Botv2 {
	constructor() {
		// this.commands = new CommandManager().commands;
		this.commands = new CommandManager();
		// TODO: make perma storage
		this.savedMessages = [];

		client.on('ready', () => {
			console.log("ready");
		});

		client.on('message', msg => {
			// If there is no stated reason to keep message, delete it after x milliseconds
			// Couldn't use msg.delete(x) as logic is needed directly before deletion, not when deletion is queued
			setTimeout(() => {
				if(this.savedMessages.indexOf(msg.id) < 0) {
					msg.delete()
					.catch(err => console.log(err.message));
				}
			}, 10000);

			// Ignore messages by bots
			if(msg.author.bot) {
				return;
			}

			let parsed = Utils.parseCommand(msg.content);

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