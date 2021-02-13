const docker = require("../docker.js");

let stoplist = [];

module.exports = {
  name: "start",
  async execute(client, event, args, db, reply) {
    let serverinfo = await db.get(`server-${event.guild_id}`);
    
    if (!serverinfo) return reply({
      embeds: [
        {
          title: "This guild does not have a server.",
          description: "You must first `/setup` the SMP Minecraft server before starting it."
        }
      ]
    });

    let nodeinfo = require("../nodes.json");

    let node = serverinfo.node;

    let allservers = await docker.listServers(nodeinfo[node.toString()].domain, nodeinfo[node.toString()].token);

    if (allservers.containers.filter(s => s.State[0] == 'running').length >= nodeinfo[node.toString()].maxrunningservers) return reply({
      embeds: [
        {
          description: "Reached the maximum amount of servers that can be running at once in this node. (`" + nodeinfo[node.toString()].maxrunningservers + '`)'
        }
      ]
    });

    let server = allservers.containers.filter(s => s.Names[0] == '/' + serverinfo.port.toString());
    if (server.length !== 1) return reply({
      embeds: [
        {
          description: "An unexpected error has occured when attempting to start this server."
        }
      ]
    });

    server = server[0];
    
    if (server.State == 'exited' || server.State == 'created') {
      reply({
        embeds: [
          {
            title: "Server is starting...",
            description: "A request has been sent for the server to start up."
          }
        ]
      });

      let given = await docker.startServer(nodeinfo[node.toString()].domain, nodeinfo[node.toString()].token, serverinfo.port);

      if (given == null) return reply(null, {
        type: 4,
        embeds: [
          {
            description: "An unexpected error has occured when attempting to start this server."
          }
        ]
      }, true);
  
      if (given !== null && given.error == "none") {

        reply(null, {
          type: 4,
          embeds: [
            {
              title: "Server is starting...",
              description: "You might need to wait few minutes in order for the server to start.\nJoin the server at `" + nodeinfo[node.toString()].ip + ":" + serverinfo.port + "`."
            }
          ]
        }, true);
        

        stoplist.push({
          info: serverinfo,
          timer: 3600
        });

      } else {
        console.log(given);
        
        reply(null, {
          type: 4,
          embeds: [
            {
              description: "An unexpected error has occured when attempting to start this server."
            }
          ]
        }, true);
        
      }
    } else {
      reply({
        embeds: [
          {
            description: "The server is already online."
          }
        ]
      });
    }

  },

  async removeList(port) {
    stoplist = stoplist.filter(v => v.info.port !== port);
  }
}

setInterval(
  async function() {
    for (let value of stoplist) {
      value.timer--;

      if (value.timer < 1) {
        let nodeinfo = require("../nodes.json");

        let node = value.info.node;

        docker.stopServer(nodeinfo[node.toString()].domain, nodeinfo[node.toString()].token, value.info.port);

        stoplist = stoplist.filter(v => v.info.port !== value.info.port);
      }
    }
  }, 1000
);