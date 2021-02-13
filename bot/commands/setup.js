const docker = require("../docker.js");
const fetch = require("node-fetch");

let creationstate = false;

module.exports = {
  name: "setup",
  async execute(client, event, args, db, reply) {
    let serverinfo = await db.get(`server-${event.guild_id}`);
    
    if (serverinfo) return reply({
      embeds: [
        {
          title: "Already created server.",
          description: "There can only be one SMP Minecraft server per Discord guild."
        }
      ]
    });

    if (creationstate == true) return reply({
      embeds: [
        {
          title: "Another server is being created currently.",
          description: "One at a time please! Try running this command again in few minutes."
        }
      ]
    });

    let nodeinfo = require("../nodes.json"); // change this to JSON.parse(fs.read) thing

    let node = 1; // node #1 = test node

    let allservers = await docker.listServers(nodeinfo[node.toString()].domain, nodeinfo[node.toString()].token);

    if (allservers.containers.length >= nodeinfo[node.toString()].maxcreatedservers) return reply({
      embeds: [
        {
          description: "Reached the maximum amount of servers that can be created on the selected node. (`" + nodeinfo[node.toString()].maxcreatedservers + '`)'
        }
      ]
    });

    creationstate = true;
    
    let portcount = await db.get("portcount-" + node);
    if (!portcount) portcount = 25565; // the starting port count will be 25566

    portcount++;

    reply({
      embeds: [
        {
          title: "Your server is being created...",
          description: "Please wait patiently as your server is being created."
        }
      ]
    });

    let given = await docker.createServer(nodeinfo[node.toString()].domain, nodeinfo[node.toString()].token, portcount);

    // add more error messages

    if (given !== null && given.error == "none") {
      await db.set(`server-${event.guild_id}`, {
        node: node, // node id
        port: portcount // port
      });

      await db.set("portcount-" + node, portcount);

      reply(null, {
        type: 4,
        embeds: [
          {
            title: "Your server has been created!",
            description: "The server address is `" + nodeinfo[node.toString()].ip + ":" + portcount + "`.\nRun the command `/start` to start the server!"
          }
        ]
      }, true);
      
      creationstate = false;
    } else {
      console.log(given);
      
      reply(null, {
        type: 4,
        embeds: [
          {
            description: "An unexpected error has occured when attempting to create this server."
          }
        ]
      }, true);
      
      creationstate = false;
    }
  }
}