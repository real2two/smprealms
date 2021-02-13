const fs = require('fs');
const zipFolder = require('zip-folder');
const path = require('path');

let codes = {};
let cooldown = new Set();

module.exports.load = async function(app, docker) {
  app.get("/download/:id", async (req, res) => {

    // Set the id variable.

    let id = req.params.id;

    if (!codes[id]) return res.send({
      error: "Invalid download code."
    });

    res.sendFile(path.resolve(__dirname + `/../servers/${codes[id]}.zip`));
  });

  app.post("/generatedownload/:id", async (req, res) => {

    // Set the id variable.

    let id = req.params.id;

    if (cooldown.has(id)) {
      return res.send({
        error: "You can only create a download code for a port every minute."
      });
    } else {
      cooldown.add(id);
      setTimeout(() => {
        cooldown.delete(id);
      }, 60000);
    }

    let zippath = `./servers/${id}.zip`;

    if (fs.existsSync(`./servers/${id}/world`)) {
      zipFolder(`./servers/${id}/world`, zippath, async function (err) {
        if (err) {
          res.send({
            error: "An error has occured when attempting to zip the server files."
          });
        } else {
          let code = id + Math.random().toString(36).substr(2);
          if (codes[code]) code = id + Math.random().toString(36).substr(2);
          codes[code] = id;
          res.send({
            error: "none",
            code: code
          });
          setTimeout(
            async function() {
              delete codes[code];
            }, 60000
          )
        }
      });
    } else {
      res.send({
        error: "Could not find the server folder."
      });
    }
  });
};