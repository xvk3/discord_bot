// Libraries
const Discord = require("discord.js");
const Promise = require('promise');
const fs = require('fs');
const emoji = require('node-emoji');
const spawn = require('child_process').spawn
const exec  = require('child_process').exec
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
        console.log(`${game.name} by ${member.user.tag}`);
        console.log(`${game.applicationID}`);
      } else {
        console.log(`null ativity by ${member.user.tag}`);
      }
      if(game) {
        if (game.applicationID === "449738622619353088" || game.name === "DARK SOULS™: REMASTERED") {
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

  if (newGame && game.applicationID === "449738622619353088") {
    newMember.addRole(playingRole).then(() => console.log(`${playingRole.name} added to ${newMember.user.tag}.`)).catch(O_o=>{});
  } else {
    newMember.removeRole(playingRole).then(() => console.log(`${playingRole.name} removed from ${newMember.user.tag}.`)).catch(O_o=>{});
  }
});

client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.

  // Ignore messages from other bots
  if(message.author.bot) return;

  // React to messages @ing the bot
  if(message.mentions.members.size !== 0)	{
    if(message.mentions.members.first() == "<@627507497007054858>") {
      console.log(`     ${message.author.id}`);
      console.log(`     ${message.guild.members.get(message.author.tag)}`);
      return message.react("\u2753").catch(O_o=>{});
    }
  }

  if( // React to "uwu" and "owo"
     message.content.includes("uwu") || 
     message.content.includes("owo")
  ) {
    message.react("❤️").catch(O_o=>{});
  }
  if( // React to "Mich"
     message.content.includes("Mich") ||
     message.content.includes("mich") ||
     message.content.includes("Mitch") ||
     message.content.includes("mitch")
  ) {
    message.react("💚").catch(O_o=>{});
  }
  if( // React to "KOKSMA"
     message.content.includes("Kok") ||
     message.content.includes("kok") ||
     message.content.includes("KOK") ||
     message.content.includes("Koksma") ||
     message.content.includes("koksma") || 
     message.content.includes("KOKSMA")
  ) {
    message.react("💝").catch(O_o=>{});
  }
  if( // React to "Mac"
     message.content.includes("Mac") ||
     message.content.includes("mac") ||
     message.content.includes("MAC")
  ) {
    message.react("💖").catch(O_o=>{});
  }
  if( // React to "CADERBOT4000"
     message.content.includes("Cader") ||
     message.content.includes("cader") ||
     message.content.includes("CADER") ||
     message.content.includes("CaderBot4000") ||
     message.content.includes("caderbot4000") ||
     message.content.includes("CADERBOT4000") ||
     message.content.includes("CB4k") ||
     message.content.includes("CB4K")
  ) {
    message.react("🤖").catch(O_o=>{});
  }
  if( // React to "Sitri"
    message.content.includes("Sitri") ||
    message.content.includes("sitri") ||
    message.content.includes("SITRI") ||
    message.content.includes("S i t r i") ||
    message.content.includes("s i t r i") ||
    message.content.includes("S I T R I")
  ) {
    message.react("💜").catch(O_o=>{});
  }
  if( // React to "Beatrice"
    message.content.includes("Bea") ||
    message.content.includes("bea") ||
    message.content.includes("BEA") ||
    message.content.includes("Beatrice") ||
    message.content.includes("beatrice") ||
    message.content.includes("BEATRICE")
  ) {
    message.react("💜").catch(O_o=>{});
  }
  if( // React to "mmdks.com"
    message.content.includes("mmdks.com") ||
    message.content.includes("MMDKS.com") ||
    message.content.includes("MMDKS.COM") ||
    message.content.includes("mmdks.COM")
  ) {
    message.react("😻").catch(O_o=>{});
  }

  if(message.content.startsWith("!")) {
    return message.channel.send(`<@${message.author.id}> Bot commands start with '+'`);
  }
  if(message.content.indexOf(config.prefix) !== 0) {
    return;
  }

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
        "value": "Prints the number of DSR players active in this server and on my Steam friends list"
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
        "name": "+souls",
        "value": "Provides a link to a table of souls required to level up and souls acquired from PvP activities"
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
        "name": "+song",
        "value": "Prints the current song Mich is listening to"
      },
      {
        "name": "+colour / +color [colour]",
        "value": "Changes your personal role colour"
      },
      {
        "name": "+colours / +colors",
        "value": "Prints the available colours for use with the +colour command"
      },
      {
        "name": "+write",
        "value": "Remember up to 10 characters"
      },
      {
        "name": "+read",
        "value": "Return the remembered text"
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

  if(command === "colour" || command === "color") {
    var colours = ['#00FFFF', '#0000FF', '#AA00AA', '#FF0000', '#FF69B4', '#FFDF00', '#FFA500', '#FFA500', '#DCDCDC', '#010101', '#FFFFFF', '#2C2F33', '#D211BC', '#FF0043'];
    var cnames  = ['cyan', 'blue', 'purple', 'red', 'pink', 'yellow', 'gold', 'orange', 'grey', 'black', 'white', 'invisible', 'sitri_pink', 'k0k_pink'];
    if(cnames.indexOf(args[0]) >= 0)  {
      var name = message.author.tag;
      var role = message.guild.roles.find(roleVal => roleVal.name === name);
      if(!role) {
        console.log(`Need to create new role for ${name}`);
        message.guild.createRole({
            name: name,
            color: 'BLACK',
        }).catch(O_o=>{});
      }
      // Color and assign role
      setTimeout(() => {
        let role = message.guild.roles.find(roleVal => roleVal.name === name);
        role.edit({
          color: colours[cnames.indexOf(args[0])]
        });
        return message.member.addRole(role);
      }, 2000);
      if(!role) return;
      role.edit({
        color: colours[cnames.indexOf(args[0])]
      })
    } else {
      return message.channel.send("Color doesn't exist @Mich and get him to add it");
    }
  }

  if(command === "colours" || command === "colors") {
    var colours = ['#00FFFF', '#0000FF', '#AA00AA', '#FF0000', '#FF69B4', '#FFDF00', '#FFA500', '#FFA500', '#DCDCDC', '#010101', '#FFFFFF', '#2C2F33', '#D211BC', '#FF0043'];
    var cnames = ['cyan', 'blue', 'purple', 'red', 'pink', 'yellow', 'gold', 'orange', 'grey', 'black', 'white', 'invisible', 'sitri_pink', 'k0k_pink'];
    var output = ""
    console.log(cnames.length);
    var embed;
    for(var i = 0; i < cnames.length; i++) {
      output = output + "\n" + cnames[i] + " = " + colours[i]
      embed = new Discord.RichEmbed({
        "title": "Available Role Colours",
        "description": output,
        "color": 0xFFFF
      });
    }
    return message.channel.send({embed}).catch(O_o=>{});      
  }

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
      return message.channel.send("Updated your record");
      });
    }
  }

  if(command === "read")  {
    fs.readFile(`/glob/${message.author.id}.st`, "UTF8", function(err, data) {
      if(err) {
        return err;
      }
      const content = data;
      return message.channel.send(`<@${message.author.id}> "${content}"`);
    });
  }

  if(command.startsWith("re") && command != "read") {
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

  if(command.startsWith("song")) {
    console.log("in song");
    exec('bash /glob/bin/scrape_spotify.sh', function callback(error, stdout, stderr){
      console.log("ok" + stdout);
    });
    setTimeout(function() {
      fs.readFile(`/glob/song`, "UTF8", function(err, data) {
        if(err) {
          return err;
        }
        const content = data;
        let embed = new Discord.RichEmbed({
          "title": "Listening to:",
          "description": `${content}`,
          "color": 0xFFFF
        });
        message.channel.send({embed}).catch(O_o=>{});
      });
    }, 1000);
  }

  if(command === "playing") {
    let memberWithRole = message.guild.members.filter(member => {
      return member.roles.find(role => role.name === "Playing");
    }).map(member => {
      return member.user.username;
    })
    if(memberWithRole.length === 1) {
      var description = `${memberWithRole.length} DSR Player (Discord)`;
    } else {
      var description = `${memberWithRole.length} DSR Players (Discord)`;
    }
    var embed = new Discord.RichEmbed({
      "title": description,
      "description": memberWithRole.join("\n"),
      "color": 0xFFFF
    });
    exec('bash /glob/bin/scrape_steam.sh', function callback(error, stdout, stderr) {
      title = "Online DSR Players (Steam)";
      let embed = new Discord.RichEmbed({
        "title": title,
        "description": `${stdout}`,
        "color": 0xFFFF
      });
      if(stdout != "" || stdout != "\n") {
        return message.channel.send({embed}).catch(O_o=>{});
      }
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

  if(command === "souls") {
    return message.channel.send("http://www.xvk3.net/souls.html");
  }

  /*
  if(command === "status") {
    message.channel.send("Not yet implemented");
  }
  */

 });

client.login(config.token);
