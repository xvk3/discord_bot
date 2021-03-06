// Libraries
const Discord = require("discord.js");
const Promise = require('promise');
const fs = require('fs');
const emoji = require('node-emoji');
const spawn = require('child_process').spawn
const exec  = require('child_process').exec
const schedule = require('node-schedule');
// Load config.json - contains bot token and prefix value
const config = require("./config.json");
let oldlive = ["xvk3"];
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

  // GHU
  var j = schedule.scheduleJob('0 0 * * 1', function(){
    const channel = client.channels.find(channel => channel.name === "ghu-lottery");
    role = list.roles.find(role => role.name === "GHU");
    return channel.send(`<@&${role.id}> Time for registration: http://www.xvk3.net/register.php`).catch(O_o=>{});
  });
  var j = schedule.scheduleJob('0 0 * * 3', function(){
    const channel = client.channels.find(channel => channel.name === "ghu-lottery");
    role = list.roles.find(role => role.name === "GHU");
    return channel.send(`<@&${role.id}> Time to sumbit your number: http://www.xvk3.net/countdown.php`).catch(O_o=>{});
  });
  var l = schedule.scheduleJob('0 0 * * 5', function(){
    const channel = client.channels.find(channel => channel.name === "ghu-lottery");
    role = list.roles.find(role => role.name === "GHU");
    return channel.send(`<@&${role.id}> Results are in: http://www.xvk3.net/results.php`).catch(O_o=>{});
  });

  // Tick
  var t = schedule.scheduleJob('00 * * * *', function(){
    const channel = client.channels.find(channel => channel.name === "testing");
    return channel.send(`Alive`).catch(O_o=>{});
  });

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
      // TODO I feel like this function can be done better
      if(game) {
        if (game.applicationID === "449738622619353088" || game.name === "DARK SOULS™: REMASTERED") {
          member.addRole(playingRole).then(() => console.log(`${playingRole.name} added to ${newMember.user.tag}.`)).catch(O_o=>{});
        } else {
          member.removeRole(playingRole).then(() => console.log(`${playingRole.name} removed from ${newMember.user.tag}.`)).catch(O_o=>{});
        }
      }
    })
  }, 60000);

  setInterval(function(){
    fs.readFile("/glob/live","UTF8", function(err, data)  {
      if(err) {
        return err;
      }
      temp = data.toString().split(" ");
      const channel = client.channels.find(channel => channel.name === "live");
      console.log(temp);
      var msgarr = [];
      channel.fetchMessages().then(msgs => {
        let filtered = msgs.filter(function(msg)  {
          name = msg.content.split(".tv/")[1];
          msgarr.push(name);
          if(temp.includes(name)) {
            return false;
          } else { 
            return true;
          }
        });
        channel.bulkDelete(filtered);
        console.log(msgarr);
        for(var i = 0; i < temp.length; i++)  {
          if(!msgarr.includes(temp[i]))  {
            channel.send(`https://www.twitch.tv/${temp[i]}`);
          }
        }
      }); 
      
    });
  }, 20000);
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

client.on("guildMemberAdd", (guild, member) => {
  // This event triggers when a new member joins a guild
  
});

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
  //if(message.author.bot) return;

  // #anonymous channel
  if(message.channel.id == 756029986011611196)  {
    // Ignore messages from other bots
    if(message.author.bot) return; 
    var msg = message.content;
    if(message.content.startsWith("+embed")) {
      tmp = message.content.substr(message.content.indexOf(" ") + 1);
      let ttl = tmp.substr(0, tmp.indexOf(" ") + 1);
      tmp = tmp.substr(tmp.indexOf(" ") + 1);
      let embed = new Discord.RichEmbed({
        "title": ttl,
        "description": tmp,
        "color": 0xFFFF
      });
      message.delete().catch(O_o=>{});
      return message.channel.send({embed}).catch(O_o=>{});
    } else if(message.attachments.size > 0)  {
      var att = (message.attachments).array();
      att.forEach(function(attachment) {
        console.log(attachment.url);
        message.channel.send(msg, {files: [attachment.url]}).catch(O_o=>{});
      });
    }
    message.delete().catch(O_o=>{});
    return message.channel.send(msg).catch(O_o=>{});
  }

  // React to messages @ing the bot
  //if(message.mentions.members.size !== 0)	{
  //  if(message.mentions.members.first() == "<@627507497007054858>") {
  //    console.log(`     ${message.author.id}`);
  //    consle.log(`     ${message.guild.members.get(message.author.tag)}`);
  //    return message.react("\u2753").catch(O_o=>{});
  //  }
  //}

  // React to all message from TheMain
  if(message.author.id == 284607342824259584) {
    message.react("💩").catch(O_o=>{});
    message.react("⚔️").catch(O_o=>{});
  }

  /*if(message.author.id == 418474957748568067) {
    message.react(client.emojis.get("761469313638727700")).catch(O_o=>{});
  }*/

  // TODO make this read the matches and emoji from a file instead
  if( // React to "uwu" and "owo"
     message.content.includes("uwu") || 
     message.content.includes("owo")
  ) {
    message.react("❤️").catch(O_o=>{});
  }
  if( // React to "Mich"
     message.content.includes("Mich ") || message.content.includes(" Mich") ||
     message.content.includes("mich ") || message.content.includes(" mich") ||
     message.content.includes("Mitch") || message.content.includes(" Mitch") ||
     message.content.includes("mitch") || message.content.includes(" mitch")
  ) {
    message.react("💚").catch(O_o=>{});
    message.react(client.emojis.get("757611838933565542")).catch(O_o=>{});
  }
  if( // React to "KOKSMA"
     message.content.includes("Kok ") || message.content.includes(" Kok") ||
     message.content.includes("kok ") || message.content.includes(" kok") ||
     message.content.includes("KOK ") || message.content.includes(" KOK") ||
     message.content.includes("Koksma ") || message.content.includes(" Koksma") ||
     message.content.includes("koksma ") || message.content.includes(" koksma") ||
     message.content.includes("KOKSMA ") || message.content.includes(" KOKSMA")
  ) {
    message.react("💝").catch(O_o=>{});
    message.react(client.emojis.get("762629560876662815")).catch(O_o=>{});
  }
  if( // React to "Mac"
     message.content.includes("Mac ") || message.content.includes(" Mac") ||
     message.content.includes("mac ") || message.content.includes(" mac") ||
     message.content.includes("MAC ") || message.content.includes(" MAC") ||
     message.content.includes("Macaroni ") || message.content.includes(" Macaroni")
  ) {
    message.react("💖").catch(O_o=>{});
  }
  if( // React to "CADERBOT4000"
     message.content.includes("Cader ") || message.content.includes(" Cader") ||
     message.content.includes("cader ") || message.content.includes(" cader") ||
     message.content.includes("CADER ") || message.content.includes(" CADER") ||
     message.content.includes("CaderBot4000 ") || message.content.includes(" CaderBot4000") ||
     message.content.includes("caderbot4000 ") || message.content.includes(" caderbot4000") ||
     message.content.includes("CADERBOT4000 ") || message.content.includes(" CADERBOT4000") ||
     message.content.includes("CB4k")
  ) {
    message.react("🤖").catch(O_o=>{});
  }
  if( // React to "Sitri"
    message.content.includes("Sitri" ) || message.content.includes(" Sitri") ||
    message.content.includes("sitri" ) || message.content.includes(" sitri") ||
    message.content.includes("SITRI" ) || message.content.includes(" SITRI") ||
    message.content.includes("S i t r i" ) || message.content.includes(" S i t r i") ||
    message.content.includes("s i t r i" ) || message.content.includes(" s i t r i") ||
    message.content.includes("S I T R I" ) || message.content.includes(" S I T R I")
  ) {
    message.react("💜").catch(O_o=>{});
  }
  if( // React to "Beatrice"
    message.content.includes("Bea ") || message.content.includes(" Bea") ||
    message.content.includes("bea ") || message.content.includes(" bea") ||
    message.content.includes("BEA ") || message.content.includes(" BEA") ||
    message.content.includes("Beatrice ") || message.content.includes(" Beatrice") ||
    message.content.includes("beatrice ") || message.content.includes(" beatrice") ||
    message.content.includes("BEATRICE ") || message.content.includes(" BEATRICE")
  ) {
    message.react("❤️").catch(O_o=>{});
  }
  if( // React to "Josk1y"
    message.content.includes("Josk ") || message.content.includes(" Josk") ||
    message.content.includes("josk ") || message.content.includes(" josk") ||
    message.content.includes("JOSK ") || message.content.includes(" JOSK") ||
    message.content.includes("Josk1y ") || message.content.includes(" Josk1y") ||
    message.content.includes("josk1y ") || message.content.includes(" josk1y") ||
    message.content.includes("JOSK1Y ") || message.content.includes(" JOSK1Y")
  ) {
    message.react("🖤").catch(O_o=>{});
  }
  if( // React to "Cone"
    message.content.includes("Cone ") || message.content.includes(" Cone") ||
    message.content.includes("cone ") || message.content.includes(" cone") ||
    message.content.includes("CONE ") || message.content.includes(" CONE")
  ) {
    message.react("⚠️").catch(O_o=>{});
  }
  if( // React to "Martin"
    message.content.includes("Martin ") || message.content.includes(" Martin") ||
    message.content.includes("martin ") || message.content.includes(" martin") ||
    message.content.includes("MARTIN ") || message.content.includes(" MARTIN")
  ) {
    message.react(client.emojis.get("760201339690156033")).catch(O_o=>{});
  }
  if( // React to "EasyBacon"
    message.content.includes("EasyBacon ") || message.content.includes(" EasyBacon") ||
    message.content.includes("easybacon ") || message.content.includes(" easybacon") ||
    message.content.includes("EASYBACON ") || message.content.includes(" EASYBACON") ||
    message.content.includes("bacon")
  ) {
    message.react(client.emojis.get("759004449296744518")).catch(O_o=>{});
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
    //return message.channel.send(`<@${message.author.id}> Bot commands start with '+'`);
  }

  // Parse commands
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
        "name": "+ptde [hours (max 168)]",
        "value": "Prints a trend and the number of PTDE players"
      },
      {
        "name": "+re / +dsr [hours (max 168)]",
        "value": "Prints a trend and the number of DSR players"
      },
      {
        "name": "+koa / +koarr [hours (max 168)]",
        "value": "Prints the number of Kingdoms of Amalur: Re-Reckoning players"
      },
      {
        "name": "+playing [SteamID]",
        "value": "Prints the number of DSR players active in this server and on either my Steam friends list or the friends list of the provided SteamID (defaults to my friends)"
      },
      {
        "name": "+ptdeing",
        "value": "Prints the number of PTDE players on my Steam friends list"
      }, 
      {
        "name": "+cheats",
        "value": "Provides a link to download Cheat Engine, Gadget and CE scripts"
      },
      {
        "name": "+cheater",
        "value": "Provides a link to a infamous Seneka08 Twitch clip"
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
        "name": "+tech",
        "value": "Provides a link to a Dark Souls 1 PvP Glossary and PvP tech YouTube playlists"
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
        "name": "+info [steamID]",
        "value": "Prints Total Playtime for DSR (only works on open Steam profiles)"
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
        "name": "+temp [hours (max 168)]",
        "value": "Get Siegmeyer's temperature (°C)"
      },
      {
        "name": "+embed [title] [content]",
        "value": "Only available in the #anonymous channel - wraps your message in a Discord Rich Embed"
      },
      {
        "name": "+write",
        "value": "Remember up to 1024 characters"
      },
      {
        "name": "+read",
        "value": "Return the remembered text"
      },
      {
        "name": "+ghu [add] [del]",
        "value": "Assign yourself the GHU role to be mentioned by Siegmeyer when the GHU lottery period changes"
      }
    ],
    "color": 0xFFFF
    });
    return message.channel.send({embed}).catch(console.log);
  }


  // Start of command parsing
  if(command === "say") {
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{});
    return message.channel.send(sayMessage).catch(O_o=>{});
  }

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
    const write = args.join(" ");
    if(write.length > 1024) {
      message.channel.send(`<@${message.author.id}> No data longer than 1024 characters!`);
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

  // Ignore messages from other bots
  if(message.author.bot) return;

  if(command === "ghu" || command === "GHU") {
    if(args[0] === "time") {
      // Run bash program to curl GHU PHP info
      console.log("time");

    } else if(args[0] === "status") {
      // Superseeds "time" ???
      return message.react("").catch(O_o=>{});

    } else if(args[0] === "del") {
      let role = message.guild.roles.find(roleVal => roleVal.name === "GHU");
      if(role)  {
        message.member.removeRole(role).catch(O_o=>{});
        return message.channel.send("Removed GHU role");
      }  

    } else if(args[0] === "add") {
      let role = message.guild.roles.find(roleVal => roleVal.name === "GHU");
      if(role)  {
        message.member.addRole(role).catch(O_o=>{});
        return message.channel.send("Added GHU role");
      }

    } else {
      return message.channel.send("Unknow +ghu command");
    }
  }

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
    const write = args.join(" ");
    if(write.length > 1024) {
      message.channel.send(`<@${message.author.id}> No data longer than 1024 characters!`);
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

  if(command === "live")  {
    if(args[0] === "add") {
      // Add
      const add = ""; 
    } else if(args[0] === "del")  {
      // Delete
    } else {
      // List
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

  if(command === "re" || command === "dsr") {
    var duration = "24";
    if(args[0] != "" && !isNaN(args[0]) && args[0] != "0" && args[0] != undefined) {
      duration = args[0];
    }
    const players = spawn("/glob/bin/dsr.sh");
    players.stdout.on("data", function(data) {
      let embed = new Discord.RichEmbed({
        "title": "Online DSR Players",
        "description": `${data.toString()}`,
        "color": 0xFFFF
      });
      return message.channel.send({embed}).catch(O_o=>{});
    });
    exec(`bash /glob/bin/tdsr.sh ${duration}`, function callback(error, stdout, stderr) {
      let embed = new Discord.RichEmbed({
        "title": `DSR Players (${duration} Hours)`,
        "description": `\`\`\`\n${stdout.toString()}\`\`\``,
        "color": 0xFFFF
      });
      return message.channel.send({embed}).catch(O_o=>{});
    });
  }

  if(command === "temp") {
    var duration = "24";
    if(args[0] != "" && !isNaN(args[0]) && args[0] != "0" && args[0] != undefined)  {
      duration = args[0];
    }
    exec(`bash /glob/bin/ttemp.sh ${duration}`, function callback(error, stdout, stderr) {
      let embed = new Discord.RichEmbed({
        "title": `Siegmeyer's Temperature (${duration} Hours)`,
        "description": `\`\`\`${stdout.toString()}\`\`\``,
        "color": 0xFFFF
      });
      return message.channel.send({embed}).catch(O_o=>{});
    });
  }

  if(command === "ptde" || command === "ds1") {
    var duration = "24";
    if(args[0] != "" && !isNaN(args[0]) && args[0] != "0" && args[0] != undefined) {
      duration = args[0];
    }
    const players = spawn("/glob/bin/ptde.sh");
    players.stdout.on("data", function(data) {
      let embed = new Discord.RichEmbed({
        "title": "Onine PTDE Players",
        "description": `${data.toString()}`,
        "color": 0xFFFF
      });
      return message.channel.send({embed}).catch(O_o=>{});
    });
    exec(`bash /glob/bin/tptde.sh ${duration}`, function callback(error, stdout, stderr) {
      let embed = new Discord.RichEmbed({
        "title": `PTDE Players (${duration} Hours)`,
        "description": `\`\`\`\n${stdout.toString()}\`\`\``,
        "color": 0xFFFF
      });
      return message.channel.send({embed}).catch(O_o=>{});
    });
  }

  if(command === "koa" || command === "koarr")  {
    var duration = "24";
    if(args[0] != "" && !isNaN(args[0]) && args[0] != "0" && args[0] != undefined) {
      duration = args[0];
    }
    const players = spawn("/glob/bin/koarr.sh");
    players.stdout.on("data", function(data) {
      let embed = new Discord.RichEmbed({
        "title": "Online KOA:RR Players",
        "description": `${data.toString()}`,
        "color": 0xFFFF
      });
      return message.channel.send({embed}).catch(O_o=>{});
    });
    exec(`bash /glob/bin/tkoarr.sh ${duration}`, function callback(error, stdout, stderr) {
      let embed = new Discord.RichEmbed({
        "title": `KOA:RR Players (${duration}) Hours)`,
        "description": `\`\`\`\n${stdout.toString()}\`\`\``,
        "color": 0xFFFF
      });
      return message.channel.send({embed}).catch(O_o=>{});
    });
  }

  if(command === "info")  {
    var player = "";
    if(args[0] != "" && args[0] != undefined) {
      player = args[0];
      if(args[0].toLowerCase() === "themain") {
        player = "76561198157181094";
      } else if(args[0].toLowerCase() === "zokye")  {
        player = "76561198147518209";
      }
    }
    console.log(player);
    var Player = "Mich";
    exec(`bash /glob/bin/scrape_steam_name.sh ${player}`, function callback(error, stdout, stderr){
      Player = stdout.toString();
    });
    console.log(Player);
    exec(`bash /glob/bin/scrape_steam_info.sh ${player}`, function callback(error, stdout, stderr){
      let embed = new Discord.RichEmbed({
        "title": `${Player}'s Total DSR Playtime`,
        "description": `${stdout.toString()}`,
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

  if(command === "ptdeing") {
    exec('bash /glob/bin/scrape_steam_ptde.sh', function callback(error, stdout, stderr) {
      title = "Online PTDE Players (Steam)";
      let embed = new Discord.RichEmbed({
        "title": title,
        "description": `${stdout}`,
        "color": 0xFFFF
      });
      if(stdout != "" || stdout != "\n") {
        return message.channel.send({embed}).catch(O_o=>{});
      }
    });
  }

  if(command === "playing") {
    console.log(args[0]);
    var sid = "";
    if(args[0] != "" && args[0] != "0" && args[0] != undefined) {
      if(args[0].toLowerCase() === "themain") {
        sid = "76561198157181094";
      } else {
        sid = args[0];
      }
    }
    console.log(sid);
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
    var name = "";
    exec(`bash /glob/bin/scrape_steam_get_name.sh ${sid}`, function callback(error, stdout, stderr) {
      name = stdout;
    });
    exec(`bash /glob/bin/scrape_steam.sh ${sid}`, function callback(error, stdout, stderr) {
      title = `Online DSR Players (Steam - ${name}'s Friend List)`;
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

  if(command === "tech") {
    message.channel.send("https://docs.google.com/document/d/1Pk9zUUWBCOo65KyfVM-vClDU390SzmKfZqLWRUjtf5o");
    message.channel.send("ds pvp tec - bob bob https://www.youtube.com/playlist?list=PLUI-OAki-Yxe17OcRW7xdOi4cSD3AVloZ");
    message.channel.send("Dark Souls PvP Guides - Cestial https://www.youtube.com/playlist?list=PLwvNUIk9YHJ6Vn8DDM8SQu2fvgSDOcSH-");
    return 1;
  }

  if(command === "joke") {
    num = Math.floor(Math.random() * Math.floor(10));
    console.log(num.toString());
    switch(num) {
      case 9:
        joke = "TheMain";
        break;
      case 8:
        joke = "What's pink and hard?";
        message.channel.send(joke).catch(O_o=>{});
        joke = "||A pig with a switchblade||";
        break;
      case 7:
        joke = "HHFC";
        break;
      case 6:
        joke = "Endeavour";
        break;
      case 5:
        joke = "Zokora";
        break;
      default:
        joke = "Seneka08";
    }
    return message.channel.send(joke).then(sentMsg => { 
      sentMsg.react("😂").catch(O_o=>{});
      sentMsg.react("🤣").catch(O_o=>{});
      sentMsg.react("😆").catch(O_o=>{});
    });
  }

  if(command === "level") {
    num = Math.floor(Math.random() * Math.floor(135));
    if(message.author.id == 394725868208914434)  {
      return message.channel.send("You have ascended beyond the realm of mortal levels into the multi-dimensional space inhabited by true legends!").catch(O_o=>{});
    }
    return message.channel.send(`You are level ${num}!`).catch(O_o=>{});
  }

  if(command === "cheats" || command === "cheat") {
    return message.channel.send("http://www.xvk3.net/dsr/cheats.html");
  }
  
  if(command === "cheater") {
    return message.channel.send("https://www.twitch.tv/seneka08/clip/DrabBoldWalrusBrainSlug");
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

  if(command === "mich")  {
    return message.channel.send("FAK U MICH");
  }

  if(command === "beep")  {
    return message.channel.send("boop");
  }
  
  if(command === "duel")  {
    return message.channel.send({files: ["https://i.imgur.com/hUtMq4S.png"]});
  }

  if(command === "servers") {
    message.channel.send("Alaine's FC Discord: https://discord.gg/rpTD644");
    message.channel.send("Cone's PvP Tavern: https://discord.gg/7H3Cs9F");
    message.channel.send("Bonfire Discord: https://discord.gg/NpB9CkX");
    message.channel.send("CoSC Discord: https://discord.gg/RV2VyyM");
    return message.channel.send("Yomi (PTDE) Discord: https://discord.gg/xwy8dys");
  }

  if(command === "plin")  {
    if(args[0] === "plin")  {
      return message.channel.send("plon");
    } else {
      return message.channel.send("plin");
    }
  }
  
  if(command === "plon")  {
    if(args[0] === "plin")  {
      return message.channel.send("plin");
    } else {
      return message.channel.send("plin plin");
    }
  }

  if(command === "ban" || command === "block" || command === "kick")  {
    return message.channel.send(`NO! I like ${args[0]}`).catch(O_o=>{});
  }

});

client.login(config.token);
