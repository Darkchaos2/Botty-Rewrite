let Command = require("./command.js");

class NAME extends Command {
	constructor() {
		super();
	}

	parse(commandName, params, msg, client) {
		msg.content = msg.content.toLowerCase();

		if		(msg.content.indexOf("darkchaos>akamatsu") > -1 || msg.content.indexOf("darkchaos > akamatsu") > -1 || msg.content.indexOf("akamatsu<darkchaos") > -1 || msg.content.indexOf("akamatsu < darkchaos") > -1)
			msg.channel.send(`I couldn't agree more, ${msg.author}!`);
		
		else if	(msg.content.indexOf("darkchaos<akamatsu") > -1 || msg.content.indexOf("darkchaos < akamatsu") > -1 || msg.content.indexOf("akamatsu>darkchaos") > -1 || msg.content.indexOf("akamatsu > darkchaos") > -1)
			msg.channel.send(`:thinking: ${msg.author}!`);
		
		else if	(msg.content.indexOf("who is the best vice technical officer") > -1 || msg.content.indexOf("who is the best vto") > -1)
			msg.channel.send(`It's a close one but I must say Darkchaos has to be up there, ${msg.author}!`);
		
		else if	(msg.content.indexOf("don't don't kill your self") > -1 || msg.content.indexOf("don't don't kill yourself") > -1) 
			msg.channel.send(`Well that's not very nice, ${msg.author}. :sob:`);
		
		else if	(msg.content.indexOf("#blameabby") > -1) 
			msg.channel.send(`But what did Abby do, ${msg.author}?`);
		
		else if	(msg.content.indexOf("⬆ ⬆ ⬇ ⬇ ⬅ ➡ ⬅ ➡ 🇧 🇦") > -1) 
			msg.channel.send(`:blush: ${msg.author} `);
		
		else if	(msg.content.indexOf("what do i do with a load of lego cards?") > -1) 
			msg.channel.send(`I have no clue, ${msg.author}. If you find out, please tell Darkchaos!`);
		
		else if	(msg.content.indexOf("& knuckles") > -1) 
			msg.channel.send(`Everything is better with Knuckles, ${msg.author}!`);
		
		else if	(msg.content.indexOf("shutupkareem") > -1) {
			/*// temporarily join afk to test is kareem is speaking. .speaking doesnt seem to work when botty is not in a voice channel
			client.guilds.find("id", settings.guildID).channels.find("id", "257883067530739713").join()
			.then(connection => {
				//if(client.guilds.find("id", settings.guildID).members.find("id", "233209917119397888").speaking == true) {
					client.guilds.find("id", settings.guildID).members.find("id", "157234925425131520").voiceChannel.join()
					.then(connection => {
						const dispatcher = connection.playFile('./extras/phrases/shut up Kareem.mp3')
						.on("start", start => 
			msg.channel.send(`Telling Kareem to shutting up, ${msg.author}`))
						.on("end", end => connection.disconnect());
					})
					.catch(console.log);
				/*}
				else {
					connection.disconnect();
					
			msg.channel.send(`Kareem is not currently talking, ${msg.author}`);
				}
			})
			.catch(console.log);*/
			
			msg.channel.send(`Due to Botty's past overexcitement to this command, it has been disabled for the foreseeable future, ${msg.author}.`);
		}
		
		// find ree based on words now indexof
		else if(msg.content.indexOf("ree") == 0) {
			/*client.channels.find("id", msgParas).join()
			.then(connection => {
				const dispatcher = connection.playFile('./extras/phrases/ree.mp3');
				dispatcher.on("start", start => 
			msg.channel.send("Reeing `" + client.channels.find("id", msgParas).name + "` channel"));
				dispatcher.on("end", end => connection.disconnect());
			})
			.catch(console.error);*/
			
			msg.channel.send(`Unfortunately, alongside the much anticipated 'shut up kareem' command, this feature has been disabled, ${msg.author}.`);
		}
		
		else if(msg.content.indexOf("perfectly functional") > -1) 
			msg.channel.send("**Unexpected error occured**\n" + ["TypeError: Invalid arguments", "SyntaxError: Unexpected `perfectly`", "InternalError: Too much recursion", "ReferenceError: `chair_for_april_2017` is not defined", "ReferenceError: `mvx` is not defined", "ReferenceError: Cannot find a more important role than `gaming_officer` in `kareems_notebook`", "RangeError: Invalid array length"][Math.floor(Math.random() * 5)] + ":" + Math.floor(Math.random() * 500));
		
		else if(msg.content.indexOf("do you know de wey") > -1 || msg.content.indexOf("do you know the way") > -1 || msg.content.indexOf("do you know the wey") > -1 ) 
			msg.channel.send("I cannot tell you de wey as you are not one with the *Devil*\n\n**Remaining requirements:\n**" + ["Find de Queen", "Level 10 Ebola", "Split on the non-believers", "Recruit 100 brudas"][Math.floor(Math.random() * 3)]);
		
		else {
			// console.log(`${this.commandName} failed`);
			return false;
		}

		return true;
	}
}

module.exports = NAME;