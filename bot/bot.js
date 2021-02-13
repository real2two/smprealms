let docker = require("./docker.js");
let database = require("./database.js");

let fs = require("fs");

let requests = require("axios").default;
let Discord = require("discord.js");
const client = new Discord.Client({
  presence: { activity: { name: 'all the servers. Type "/" for the list of commands.', type: 'WATCHING' }, status: 'online' },
  messageCacheLifetime: 300,
  messageSweepInterval: 600,
});


//client.on("ready", () => { console.log("Me is ready") });

client.commands = new Discord.Collection()

let commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
let cmdnames = [];
for (let file of commandFiles) {
  let command = require(`./commands/${file}`);
  if (command.name !== "terms" && command.name !== "privacy" && command.name !== "donate") { cmdnames.push(command.name); }
  client.commands.set(command.name, command);
}

client.on("guildCreate", async (guild) => {
  if ((await guild.members.fetch(client.user.id)).hasPermission('MANAGE_ROLES')) {
    for (let name of cmdnames) {
      if (!client.guilds.cache.get(guild.id).roles.cache.some(role => role.name === 'Minecraft /' + name)) {
        guild.roles.create({ data: { name: 'Minecraft /' + name } });
      }
    }
  }
});

let cooldowns = new Discord.Collection();

client.ws.on("INTERACTION_CREATE", async (event) => {
  //console.log(event)

  if (client.guilds.cache.get(event.guild_id)) {

    let commandName = event.data.name

    if (commandName !== "terms" && commandName !== "privacy" && commandName !== "donate") {
      if (!client.guilds.cache.get(event.guild_id).roles.cache.some(role => role.name === 'Minecraft /' + commandName)) return reply(
        {
          flags: 64,
          content: "You must have the role called `Minecraft /" + commandName + "` in order to use this command.",
        },
        {
          type: 3
        }
      );
  
      if (!(await client.guilds.cache.get(event.guild_id).members.fetch(event.member.user.id)).roles.cache.some(role => role.name === 'Minecraft /' + commandName)) return reply(
        {
          flags: 64,
          content: "You must have the role called `Minecraft /" + commandName + "` in order to use this command.",
        },
        {
          type: 3
        }
      );
    }

    //command handling
    let args = event.data.options

    let command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    //Cooldown system
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Discord.Collection());
    }

    let now = Date.now();
    let timestamps = cooldowns.get(command.name);
    let cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(event.member.user.id)) {
      let expirationTime = timestamps.get(event.member.user.id) + cooldownAmount;

      if (now < expirationTime) {
        let timeLeft = (expirationTime - now) / 1000;
        return reply(
          {
            flags: 64,
            content: `Wait ${timeLeft.toFixed(1)} seconds before running this again.` // \n [Custom developments test redirect](https://customdev.xyz)
          },
          {
            type: 3
          }
        );
      }
    }

    timestamps.set(event.member.user.id, now);
    setTimeout(() => timestamps.delete(event.member.user.id), cooldownAmount);

    //Attempt execution of the command
    try {
      command.execute(client, event, args, database, reply);
    } catch (error) {
      console.error(error);
      return reply("There was an error running that command...")
    }
  } else {
    reply({
      embeds: [{description: "This application will not allow any commands to be ran if the Discord bot is not in the server."}]
    });
  };

  //Reply function
  async function reply(messagestring, options = { type: 4, ephemeral: false }, editoriginal = false) {
    if (options == null) options = { type: 4, ephemeral: false };

    if (typeof options.type != "number") throw new Error("Reply type must be a number")
    let url = editoriginal == true ? `https://discord.com/api/v8/webhooks/${client.user.id}/${event.token}/messages/@original` : `https://discord.com/api/v8/interactions/${event.id}/${event.token}/callback`
    let json;

    if (editoriginal !== true) {
      json = {
        "type": options.type,
      };
      if (options.type != 1 && options.type != 2 && options.type != 5) {
        if (typeof messagestring == "string") {
          if (messagestring == "") messagestring == " ";
          json.data = {
            content: `${messagestring}`
          }
        } else {
          json.data = messagestring
        }
      }

      if (options.ephemeral == true) json.data.flags = 1 << 6
    } else {
      json = options
    }

    if (editoriginal == true) {
      requests.patch(url, json).then((response) => {
        //console.log("Worked")
        //console.log(JSON.stringify(json))
      }).catch(error => {
        console.log(error)
      });
    } else {
      requests.post(url, json).then((response) => {
        //console.log("Worked")
        //console.log(json)
      }).catch(error => {
        console.log(error)
      });
    }
  }
});

client.login("ODA3Mjc0MzMxMDEyMzMzNjM5.YB1mzg.Z8riqrf23TNJT0tbWICnbDmAkPs");

/*
async function test() {
	console.log(await docker.createServer("domain", "code", 25565));

	console.log(await docker.stopServer("domain", "code", 25565));

	console.log(await docker.killServer("domain", "code", 25565));

	console.log(await docker.startServer("domain", "code", 25565));

	console.log(await docker.deleteServer("domain", "code", 25565));

	console.log(await docker.generateDownload("domain", "code", 25565));
};
*/