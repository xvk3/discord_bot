// Libraries
const Discord = require("discord.js");
const Promise = require('promise');
const fs = require('fs');
const emoji = require('node-emoji');
const spawn = require('child_process').spawn
// Load config.json - contains bot token and prefix value
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

// Initialise Discord client
const client = new Discord.Client();

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // TODO add list of possible options for activity type
  client.user.setActivity("BOT V0.1", { type: "STREAMING"});
  
  // Server
  var list = client.guilds.get("740902433491779614");

  // TODO Loop over members for presence & game activity checks
  setInterval(function(){

    list.members.forEach((member)=>{
      const guild = member.guild;
      const playingRole = guild.roles.find(role => role.name === "Playing");
       
      const game = member.presence.game;

      if(game) {
        if (game.applicationID === "449738622619353088") {
          member.addRole(playingRole).then(() => console.log(`${playingRole.name} added to ${newMember.user.tag}.`)).catch(O_o=>{});
        } else {
          member.removeRole(playingRole).then(() => console.log(`${playingRole.name} removed from ${newMember.user.tag}.`)).catch(O_o=>{});
        }
      }
    })
  }, 60000)

});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

/*client.on("guildMemberAdd", (guild, member) => {
  // This event triggers when a new member joins a guild

});*/

client.on('presenceUpdate', (oldMember, newMember) => {
  const guild = newMember.guild;
  const playingRole = guild.roles.find(role => role.name === "Playing");

  const game = newMember.presence.game;
  const oldGame = oldMember.presence.game && [0, 1].includes(oldMember.presence.game.type) ? true : false;
  const newGame = newMember.presence.game && [0, 1].includes(newMember.presence.game.type) ? true : false;

  console.log(`${newMember.user.tag} is playing ${game}`);

  if (!oldGame && newGame && game.applicationID === "449738622619353088") {
    newMember.addRole(playingRole).then(() => console.log(`${playingRole.name} added to ${newMember.user.tag}.`)).catch(O_o=>{});
  } else {
    newMember.removeRole(playingRole).then(() => console.log(`${playingRole.name} removed from ${newMember.user.tag}.`)).catch(O_o=>{});
  }
});

client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.

  // Ignore messages from other bots
  if(message.author.bot) return;

  // Also good practice to ignore any message that does not start with our prefix,
  // which is set in the configuration file.
  // However, in this case I want to react to messages @ing the bot
  if(message.mentions.members.size !== 0)	{
    if(message.mentions.members.first() == "<@627507497007054858>") {
      console.log(`     ${message.author.id}`);
      console.log(`     ${message.guild.members.get(message.author.tag)}`);
      return message.react("\u2753").catch(O_o=>{});
    }
  }

  if(message.content.includes("uwu") || message.content.includes("owo")) {
    message.react("❤️").catch(O_o=>{});
  }
  if(message.content.includes("Mich") || message.content.includes("mich") || message.content.includes("Mitch") || message.content.includes("mitch")) {
    message.react("💚").catch(O_o=>{});
  }

  if(message.content.startsWith("!")) {
    return message.channel.send(`<@${message.author.id}> Bot commands start with '+'`);
  }

  if(message.content.indexOf(config.prefix) !== 0) {
    return;
  }

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if(command === "help") {
    let embed = new Discord.RichEmbed({
      "title": "Siegmeyer Command List",
      "description": "Main list of commands for Siegmeyer (there are several easter eggs too)",
      "fields": [{
        "name": "+help",
        "value": "Prints this message"
      },
      {
        "name": "+ptde",
        "value": "Prints the number of PTDE players"
      },
      {
        "name": "+re",
        "value": "Prints the number of DSR players"
      },
      {
        "name": "+playing",
        "value": "Prints the number of DSR players active in this server"
      },
      {
        "name": "+cheats",
        "value": "Provdes a link to download Cheat Engine, Gadget and CE scripts"
      },
      {
        "name": "+poise",
        "value": "Provides a link to a table of poise damage for each weapon and attack"
      },
      {
        "name": "+tips",
        "value": "Provides a link to some DSR tips"
      },
      {
        "name": "+say [something]",
        "value": "Prints something"
      },
      {
        "name": "+joke",
        "value": "Siegmeyer tells you a joke"
      },
      {
        "name": "+write",
        "value": "Remeber up to 10 characters"
      },
      {
        "name": "+read",
        "value": "Return the remebered text"
      }
    ],
    "color": 0xFFFF
    });
    return message.channel.send({embed}).catch(console.log);
  }


  // Start of command parsing
  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use.
    // To get the "message" itself we join the `args` back into a string with spaces:
    const sayMessage = args.join(" ");

    if(message.member.roles.some(r=>["Mod"].includes(r.name)) ) {
      message.delete().catch(O_o=>{});
    }

    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }

  /*
  if(command === "uwu")	{
    const e = emoji.get("heart");
    message.channel.send(`<@${message.author.id}> ${e}`);
    console.log(command);
  }

  // This is currently bugged
  // Get warnings regarding promises.
  
  if(command === "react") {
    if(emoji.hasEmoji(args[0])) {
      const e = emoji.get(args[0]);
      console.log(e);
      message.delete().catch(O_o=>{});
      message.channel.fetchMessages({limit: 1})
        .then(function(msgCollection) {
          msgCollection.forEach(function(msg) {
            msg.react(e).catch(O_o=>{});
        }).catch(O_o=>{});
      });
    } else {
      message.channel.send("unknown emoji");
      console.log("unknown emoji");
    }
  }
  */

  if(command === "write") {
    const write = args[0];
    if(write.length > 10) {
      message.channel.send(`<@${message.author.id}> No data longer than 10 characters!`);
    } else {
      fs.writeFile(`/glob/${message.author.id}.st`, write, function(err) {
        if(err) {
          return console.log(err);
        }
      console.log("The file was saved!");
      message.channel.send("Updated your record");
      });
    }
  }
  if(command === "read")  {
    fs.readFile(`/glob/${message.author.id}.st`, "UTF8", function(err, data) {
      if(err) {
        return err;
      }
      const content = data;
      message.channel.send(`<@${message.author.id}> "${content}"`);
    });
  }

  if(command.startsWith("re")) {
    const players = spawn("/glob/bin/dsr.sh");
    players.stdout.on("data", function(data) {
    title = "Online DSR Players" + "!".repeat(command.length - 2)
      let embed = new Discord.RichEmbed({
        "title": title,
        "description": `${data.toString()}`,
        "color": 0xFFFF
      });
      return message.channel.send({embed}).catch(O_o=>{});
    });
  }

  if(command.startsWith("ptde")) {
    const players = spawn("/glob/bin/ptde.sh");
    players.stdout.on("data", function(data) {
    title = "Online PTDE Players" + "!".repeat(command.length - 2)
      let embed = new Discord.RichEmbed({
        "title": title,
        "description": `${data.toString()}`,
        "color": 0xFFFF
      });
      return message.channel.send({embed}).catch(O_o=>{});
    });
  }

  if(command === "playing") {
    let memberWithRole = message.guild.members.filter(member => {
      return member.roles.find(role => role.name === "Playing");
    }).map(member => {
      return member.user.username;
    })
    if(memberWithRole.length === 0) {
      let embed = new Discord.RichEmbed({
        "title": "There are no active DSR players in this server",
        "color": 0xFFFF
      });
      return message.channel.send({embed});
    } else if(memberWithRole.length === 1) {
      var description = `${memberWithRole.length} DSR Player (Discord)`;
    } else {
      var description = `${memberWithRole.length} DSR Players (Discord)`;
    }
    let embed = new Discord.RichEmbed({
      "title": description,
      "description": memberWithRole.join("\n"),
      "color": 0xFFFF
    });
    var players = spawn("/glob/bin/scrape_steam.sh");
    players.stdout.on("data", function(data) {
      title = "Online DSR Players (Steam)"
      let embed = new Discord.RichEmbed({
        "title": title,
        "description": `${data.toString()}`,
        "color": 0xFFFF
      });
      return message.channel.send({embed}).catch(O_o=>{});
    });
    return message.channel.send({embed}); 
  }

  if(command === "fcf") {
    message.channel.send("https://www.youtube.com/watch?v=IgHu7OyB3aA");
    return 1;
  }

  if(command === "joke") {
    return message.channel.send("Seneka08").then(sentMsg => { 
      sentMsg.react("😂").catch(O_o=>{});
      sentMsg.react("🤣").catch(O_o=>{});
      sentMsg.react("😆").catch(O_o=>{});
  });
  }

  if(command === "cheats" || command === "cheat") {
    return message.channel.send("http://www.xvk3.net/dsr/cheats.html");
  }

  if(command === "poise") {
    return message.channel.send("http://www.xvk3.net/dsr/poise.html");
  }

  if(command === "tips") {
    return message.channel.send("http://www.xvk3.net/dsr/tips.html");
  }

  /*
  if(command === "status") {
    message.channel.send("Not yet implemented");
  }

  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit: 
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    
    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }
  
  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable) 
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }
  
  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
  */
});

client.login(config.token);
