const docker = require("../docker.js");

module.exports = {
  name: "info",
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

    let server = allservers.containers.filter(s => s.Names[0] == '/' + serverinfo.port.toString());
    if (server.length !== 1) return reply({
      embeds: [
        {
          description: "An unexpected error has occured when attempting to get this server's information."
        }
      ]
    });

    server = server[0];

    reply({
      embeds: [
        {
          title: "Server Information",
          description:
`**Node**: ${nodeinfo[node.toString()].name}
**IP**: \`${nodeinfo[node.toString()].ip}:${serverinfo.port}\`
**Status**: ${server.State == "running" ? "Online" : "Offline" }`
        }
      ]
    });
  }
};