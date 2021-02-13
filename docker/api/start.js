const fs = require("fs");

module.exports.load = async function(app, docker) {
  app.post("/start/:id", async (req, res) => {

    // Set the id variable.

    let id = req.params.id;

    // Gets and starts the container.

    let container = docker.getContainer(id);

    container.start((err) => {
      if (err) {
        return res.send({
          error: "An error has occured when attempting to start the container."
        });
      }

      // server.properties

      let port = id;
      let motd = fs.readFileSync('./motd.txt').toString();

      fs.writeFile(`./servers/${id}/server.properties`, `spawn-protection=0\nmax-tick-time=60000\nquery.port=${port}\ngenerator-settings=\nsync-chunk-writes=true\nforce-gamemode=false\nallow-nether=true\nenforce-whitelist=true\ngamemode=survival\nbroadcast-console-to-ops=true\nenable-query=false\nplayer-idle-timeout=0\ntext-filtering-config=\ndifficulty=normal\nspawn-monsters=true\nbroadcast-rcon-to-ops=true\nop-permission-level=4\npvp=true\nentity-broadcast-range-percentage=100\nsnooper-enabled=true\nlevel-type=default\nhardcore=false\nenable-status=true\nenable-command-block=true\nmax-players=10\nnetwork-compression-threshold=256\nresource-pack-sha1=\nmax-world-size=29999984\nfunction-permission-level=2\nrcon.port=${port}\nserver-port=${port}\ntexture-pack=\nserver-ip=\nspawn-npcs=true\nallow-flight=true\nlevel-name=world\nview-distance=10\nresource-pack=\nspawn-animals=true\nwhite-list=false\nrcon.password=minecraft\ngenerate-structures=true\nmax-build-height=256\nonline-mode=true\nlevel-seed=\nprevent-proxy-connections=false\nuse-native-transport=true\nenable-jmx-monitoring=false\nenable-rcon=false\nrate-limit=0\nmotd=${motd}`, function(err) {
      if (err) throw err;
      });
      
      res.send({
        error: "none"
      });
    });

  });
};