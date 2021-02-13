const docker = require("../docker.js");

module.exports = {
  name: "whitelist",
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

    // Use .split(",") and .trim()

    let nodeinfo = require("../nodes.json");
  
    let node = serverinfo.node;

    if (!args) {
      let thewhitelist = await docker.whitelist(nodeinfo[node.toString()].domain, nodeinfo[node.toString()].token, serverinfo.port);
  
      if (thewhitelist.error == "Could not find whitelist.json.") thewhitelist = { error: "none", whitelist: [] };

      let thewhitelist2 = [];

      for (let player of thewhitelist.whitelist) {
        thewhitelist2.push(`${player.name} (\`${player.uuid}\`)`);
      }

      reply({
        embeds: [
          {
            title: "Whitelisted Players",
            description: (thewhitelist.whitelist.length == 0 ? "No one is currently whitelisted on the server." : "- " + thewhitelist2.join("\n- ")) + "\n\nYou can set the whitelisted people using `/whitelist Username1, Username2, etc`.\nYou can remove everyone from whitelist using `/whitelist ,`."
          }
        ]
      });
    } else {
      let arg = args[0].value.split(",");

      if (arg.length == 0) return reply({
        embeds: [
          {
            description: "Missing arguments. (how did you get this?)"
          }
        ]
      });

      let realargs = [];

      for (let username of arg) {
        realargs.push(username.trim().toLowerCase());
      }; //stackoverflow :)

      realargs = remove_duplicates(realargs);

      if (realargs.length > 10) return reply({
        embeds: [
          {
            description: "You can only whitelist up to 10 players."
          }
        ]
      });

      if (realargs.length == 1 && realargs[0] == '') realargs = [];
  
      let whitelistcallback = await docker.whitelistSet(nodeinfo[node.toString()].domain, nodeinfo[node.toString()].token, serverinfo.port, realargs);

      // just gave up, apparently node-fetch wont like BODY parameters smh, sorry dude

      if (whitelistcallback.error == "none") {
        return reply({
          embeds: [
            {
              description: "Successfully modified whitelist to these players. The server might require a restart for the changes to take effect." // tcan you make the stop cmd on discord
            }
          ]
        });
      }

      if (whitelistcallback.error == "player.found was not given back.") {
        return reply({
          embeds: [
            {
              description: "Looks like one of the usernames provided is invalid. Make sure these usernames are legit and not cracked."
            }
          ]
        });
      }

      console.log(whitelistcallback);

      reply({
        embeds: [
          {
            description: "An unexpected error has occured when attempting to whitelist players."
          }
        ]
      });
    }
  } 
}

// https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array?page=2&tab=votes#tab-top

function remove_duplicates(array_) {
  let ret_array = new Array();
  for (let a = array_.length - 1; a >= 0; a--) {
    for (let b = array_.length - 1; b >= 0; b--) {
      if (array_[a] == array_[b] && a != b){
        delete array_[b];
      };
    };
    if (array_[a] != undefined) ret_array.push(array_[a]);
  };
  return ret_array;
}