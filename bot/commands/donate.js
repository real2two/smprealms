const docker = require("../docker.js");

module.exports = {
  name: "donate",
  async execute(client, event, args, db, reply) {
    reply({
      embeds: [
        {
          title: "Donations",
          description: 
` We need donations so we can stay running and have better running servers!
We have been working very hard on this bot, so it would be very nice of you to send us some donations!

We are accepting donations at [link]!`
        }
      ]
    });
  }
} 