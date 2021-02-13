const fs = require("fs");
const fetch = require("node-fetch");

module.exports.load = async function(app, docker) {
  app.get("/whitelist/:id", async (req, res) => {
    if (!fs.existsSync(`./servers/${req.params.id}/whitelist.json`)) return res.send({
      error: "Could not find whitelist.json."
    });

    res.send({
      error: "none",
      whitelist: JSON.parse(fs.readFileSync(`./servers/${req.params.id}/whitelist.json`).toString())
    })
  });

  app.post("/whitelist/:id", async (req, res) => {
    // Check if the body is an object and not an array.

    if (typeof req.body !== "object") return res.send({ error: "The body must be an object." });
    if (Array.isArray(req.body)) return res.send({ error: "The body cannot be an array." });

    // Username checking.

    let usernames = req.body.usernames;

    if (!usernames) return res.send({
      error: "Missing usernames variable."
    });

    if (!Array.isArray(usernames)) return res.send({
      error: "The usernames must be an array."
    });

    let whitelist = [];
    
    for (let username of usernames) {
      let userinfo = await getPlayer(res, username);
      if (userinfo == null) return;
      whitelist.push(userinfo);
    }

    // Output.

    if (!fs.existsSync(`./servers/${req.params.id}/`)) {
      fs.mkdir(`./servers/${req.params.id}/`, (err) => {
        if (err) {
          return console.log(err);
        }
        fs.writeFile(`./servers/${req.params.id}/whitelist.json`, JSON.stringify(whitelist), function(err) {
        if (err) throw err;
        });
      });
    } else {
      fs.writeFile(`./servers/${req.params.id}/whitelist.json`, JSON.stringify(whitelist), function(err) {
      if (err) throw err;
      });
    }

    res.send({
      error: "none",
      whitelist: whitelist
    });
  });
};

async function getPlayer(res, username) {
  let fetched = await fetch(
    "https://playerdb.co/api/player/minecraft/" + encodeURIComponent(username),
    {
      method: "get"
    }
  );
  try {
    let usernameinfo = JSON.parse(await fetched.text());
    if (usernameinfo.code == "player.found") {
      let actualusername = usernameinfo.data.player.username;
      let uuid = usernameinfo.data.player.id;
      try {
        return {
          uuid: uuid,
          name: actualusername
        }
      } catch(err2) {
        console.log(err2);
      }
    } else {
      res.send({
        error: "player.found was not given back.",
        info: usernameinfo
      });
      return null;
    }
  } catch(err) {
    res.send({
      error: "An error has occured when communicating playerdb.co."
    });
    return null;
  }
}