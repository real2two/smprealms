const docker = require("../docker.js");

module.exports = {
  name: "download",
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

    let given = await docker.generateDownload(nodeinfo[node.toString()].domain, nodeinfo[node.toString()].token, serverinfo.port);

    if (given.error == "none") return reply({
      flags: 64,
      content: "You can download the world here (expires in a minute): http://node" + node.toString() + ".example.com/download/" + given.code
    }, {type: 3});

    if (given.error == "Could not find the server folder.") return reply({
      flags: 64,
      content: "The server has never been started before, therefore there is nothing to download."
    }, {type: 3});

    if (given.error == "You can only create a download code for a port every minute.") return reply({
      flags: 64,
      content: "Someone has generated a download code within a minute ago. This command has a server-wide cooldown of a minute, so you must wait about a minute in order to use this command."
    }, {type: 3});

    reply({
      flags: 64,
      content: "An unexpected error has occured when attempting to generate a download link of the world."
    }, {type: 3});
    console.log(given);
  }
}