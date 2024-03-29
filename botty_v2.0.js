// Add bot to server, replace [botid] with the bot id. Make sure you have the correct permissions to invite a bot.
// https://discordapp.com/oauth2/authorize?client_id=[botid]&scope=bot&permissions=0
// go here: https://discordapi.com/permissions.html

// EXTERNAL DEPENDENCIES
const Discord = require('discord.js');
const fs = require('fs');
const ini = require('ini');

// INETERNAL DEPENDENCIES
const CommandManager = require('./commands/CommandManager.js');
const StateManager = require('./states/StateManager.js');
const Utils = require('./utils/Utils.js');
const Logger = require('./utils/Logger.js');
const VGSMember = require('./objects/lsucs_member.js')

// SETTINGS
const botDetails = require('./settings/botDetails.js');
let config;
let startingMessage;

// DATA
// Activity types: PLAYING, STREAMING, LISTENING, WATCHING
const activityType = ['playing', 'streaming', 'listening', 'watching'];

// FUNCTIONS
function LoadConfig() {
	config = ini.parse(fs.readFileSync('./settings/config.ini', 'utf-8'));

	if(!config.GuildDetails.savedMessageIDs)
		config.GuildDetails.savedMessageIDs = [];
}

class Botv2 {
	constructor() {
		this.userStates = {};
		this.commands = new CommandManager();

		client.on('ready', () => {
			generalLogger.Log('Restarted')

			// Set activity based on preferences
			client.user.setActivity(config.Preferences.activity, { type: activityType[config.Preferences.activityType]});

			this.UpdateSavedMessages();
			this.ClearBotChannel();
			this.UpdateDesc('Reboot');

			console.log("Ready");
		});
		
		// Role changes
		client.on('roleCreate', role => {
			this.UpdateDesc(`${role} ${role.name} created`);
		});
		client.on('roleDelete', role => {
			this.UpdateDesc(`${role} ${role.name} deleted`);
		});
		client.on('roleUpdate', (oldRole, newRole) => {
			if(oldRole.name != newRole.name) {
				this.UpdateDesc(`${oldRole} ${oldRole.name} => ${newRole}${newRole.name}`);
			}
		});

		client.on('message', msg => {
			// If user hasn't used a command (in any channel) and they are not in the bot channel, ignore
			if(!Utils.parseOutPrefix(msg, config.Preferences.prefix) && msg.channel.id != config.GuildDetails.botChannelID) {
				return;
			}

			// If in bot channel, clean channel
			if(msg.channel.id == config.GuildDetails.botChannelID) {
				// If not saved, delete after x milliseconds
				setTimeout(() => {
					if(config.GuildDetails.savedMessageIDs.indexOf(msg.id) < 0 && msg.id != config.GuildDetails.startingMessageID) {
						// Couldn't use msg.delete(x) as logic is needed directly before deletion, not when deletion is queued
						msg.delete()
						.catch(err => console.log(err.message));
					}
				}, 10000);
			}

			// Don't parse messages by bots
			if(msg.author.bot) {
				return;
			}

			// If there is no user data, create new user data
			if(!this.userStates[msg.author.id])
				this.userStates[msg.author.id] = new VGSMember(msg.author.id, msg.author.username, 'default', null, config.Preferences.userStateTimeoutLength);

			generalLogger.Log(`Command parsed`, `${msg.author} ${msg.author.username} - ${msg.content}`);

			this.userStates[msg.author.id].OnNewMessage();

			// If current returns false (user ignores their current state), do default state
			if(!states[this.userStates[msg.author.id].state].Action(this.userStates[msg.author.id], msg, this.commands, this)) {
				states['default'].Action(this.userStates[msg.author.id], msg, this.commands, this);
			}
		});

		this.login();
	}

	// Config
	LoadConfig() {
		LoadConfig();
	}
	GetConfig() {
		return config;
	}
	SetStartMessage(id) {
		config.GuildDetails.startingMessageID = id;
		this.SaveConfig()
	}
	SaveMessage(id) {
		config.GuildDetails.savedMessageIDs.push(id);
		this.SaveConfig()
	}
	// Delete saved messages that are no longer there
	UpdateSavedMessages() {
		let promises = [];

		// not using .push() as callback hell
		promises[promises.length] = client.channels.get(config.GuildDetails.botChannelID).fetchMessage(config.GuildDetails.startingMessageID)
		.catch(err => {
			config.GuildDetails.startingMessageID = false;
		});

		// for(let msgID of config.GuildDetails.savedMessageIDs) {
		for(let i = 0; i < config.GuildDetails.savedMessageIDs.length; i++) {
			let msgID = config.GuildDetails.savedMessageIDs[i];

			promises[promises.length] = client.channels.get(config.GuildDetails.botChannelID).fetchMessage(msgID)
			.catch(err => {
				console.log(`cannot find saved message ${msgID}`);
				config.GuildDetails.savedMessageIDs.splice(i, 1);
			})
		}

		Promise.all(promises)
		.then(() => {
			this.SaveConfig();
		});
	}
	SetBotChannel(id) {
		config.GuildDetails.botChannelID = id;
	}
	SaveConfig() {
		fs.writeFileSync('./settings/config.ini', ini.stringify(config));
	}

	// Starting message
	sendDesc(channel) {
		return channel.send(eval('`' + startingMessage + '`'));
	}
	UpdateDesc(reason) {
		if(!config.GuildDetails.startingMessageID)
			return;

		startingMessage = fs.readFileSync('./settings/description.txt', 'utf-8');

		client.channels.get(config.GuildDetails.botChannelID).fetchMessage(config.GuildDetails.startingMessageID)
		.then(message => message.edit(eval('`' + startingMessage + '`')))
		.then(msg => generalLogger.Log(`Description Updated`, reason))
		.catch(console.error);
	}

	ClearBotChannel() {
		// Deletes all messages not marked to be saved
		client.channels.get(config.GuildDetails.botChannelID).fetchMessages({after: config.GuildDetails.startingMessageID})
		.then(coll => {
			for(let msg of coll.values()) {
				if(config.GuildDetails.savedMessageIDs.indexOf(msg.id) == -1)
					msg.delete();
			}
		});
	}

	login() {
		// login bot
		client.login(botDetails.botToken)
		.catch(() => {
			console.log("Could not connect");
		});
	}
}

const client = new Discord.Client();
let generalLogger = new Logger('./logs/log.txt');
let states = new StateManager();

LoadConfig();
let bot = new Botv2();