const docker = require("../docker.js");

module.exports = {
  name: "reset",
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
    
    reply({
      embeds: [{description: "Coming soon."}]
    });
  }
}