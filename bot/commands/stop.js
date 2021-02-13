const docker = require("../docker.js");
const start = require("./start.js");

module.exports = {
  name: "stop",
  async execute(client, event, args, db, reply) {
    let serverinfo = await db.get(`server-${event.guild_id}`);
    
    if (!serverinfo) return reply({
      embeds: [
        {
          title: "This guild does not have a server.",
          description: "You must first `/setup` the SMP Minecraft server before stoping it."
        }
      ]
    });

    let nodeinfo = require("../nodes.json");

    let node = serverinfo.node;

    let allservers = await docker.listServers(nodeinfo[node.toString()].domain, nodeinfo[node.toString()].token);

    let server = allservers.containers.filter(s => s.Names[0] == '/' + serverinfo.port.toString());
    if (server.length !== 1) return reply({
      embeds: [
        {
          description: "An unexpected error has occured when attempting to stop this server."
        }
      ]
    });

    server = server[0];
    
    if (server.State == 'exited' || server.State == 'created') {
      reply({
        embeds: [
          {
            description: "The server is already offline."
          }
        ]
      });
    } else {
      reply({
        embeds: [
          {
            title: "Server is stoping...",
            description: "The server might take up to a minute to shutdown."
          }
        ]
      });

      start.removeList(serverinfo.port);
      
      let given = await docker.stopServer(nodeinfo[node.toString()].domain, nodeinfo[node.toString()].token, serverinfo.port);

      if (given == null) return reply(null, {
        type: 4,
        embeds: [
          {
            description: "An unexpected error has occured when attempting to stop this server."
          }
        ]
      }, true);
  
      if (given !== null && given.error == "none") {
        reply(null, {
          type: 4,
          embeds: [
            {
              title: "Server has stopped.",
              description: "The server is successfully offline."
            }
          ]
        }, true);
      } else {
        console.log(given);
        
        reply(null, {
          type: 4,
          embeds: [
            {
              description: "An unexpected error has occured when attempting to stop this server."
            }
          ]
        }, true);
        
      }
    }

  }
}