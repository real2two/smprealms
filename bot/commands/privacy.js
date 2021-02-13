const docker = require("../docker.js");

module.exports = {
  name: "privacy",
  async execute(client, event, args, db, reply) {
    reply({
      embeds: [
        {
          title: "Privacy Policy",
          description: 
`It is SMP Realms' policy to respect your privacy regarding any information we may collect from you across our services we own and operate.

By using our service or services, you agree to let us collect these following data:

\`\`\`
- We may collect any data given by Discord to our service or services.
  - This includes any user or users who use the Discord bot or bots.
    - This mainly includes guild IDs and user input.
\`\`\`

This data is needed in order for our service(s) to work including:
\`\`\`
- Provide, operate, and maintain our Discord bot.
- Improve, personalize, and expand our Discord bot.
- Understand and analyze how you use our Discord bot.
- Prevention of abuse of Discord bot functionality.
- Activity logging of Discord bot usage.
\`\`\`
We keep this information until data deletion is requested.

If you have been blacklisted from our service(s), data deletion can be automatic.

We share data with these following second and third parties:
\`\`\`
- Discord.com: SMP Realms is a Discord bot and requires Discord to run.
- PlayerDB.co: This is used to detect the Minecraft account on the /whitelist command.
\`\`\`
We may use external services in the bot that we have no control over.

If you have any concerns, you may contact us on our [Discord server](https://discord.gg/CODE) (https://discord.gg/CODE).`
        }
      ]
    });
  }
}