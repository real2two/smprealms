module.exports.load = async function(app, docker) {
  app.post("/create", async (req, res) => {

    // Check if the body is an object and not an array.

    if (typeof req.body !== "object") return res.send({ error: "The body must be an object." });
    if (Array.isArray(req.body)) return res.send({ error: "The body cannot be an array." });

    // Check and set the variables.

    let errors = [];

    let id = req.body.port;
    let port = req.body.port;
    let image = "itzg/minecraft-server";
    let layer = "latest";
    let env = ["EULA=TRUE", "MEMORY=1G"];

    // Check the port variable.

    if (port) {
      if (typeof port !== "number") {
        errors.push("The port must be a integer.");
      } else {
        port = Math.round(port);
        if (port < 1) errors.push("The port must be greater than 1.");
      };
    } else {
      errors.push("Missing port.");
    };

    // Check if there are any errors.

    if (errors.length !== 0) {
      return res.send(
        {
          error: "An error has occured with the variables.",
          variableerrors: errors
        }
      )
    };

    // Pull the image.

    docker.pull(image, (err, stream) => {

      // Checks if there was an error when pulling the image.

      if (err) {
        return res.send(
          {
            error: "An error has occured when pulling the image.",
            dockererror: err
          }
        );
      }
      let onFinished = () => {

        // Create the container.

        let containerinfo = {
          Image: image + ":" + layer,
          Env: env,
          name: id,
          Tty: true,
          ExposedPorts: {},
          Hostconfig: {
            Binds: [process.cwd() + "/servers/" + id + ":/data"],
            PortBindings: {},
          }
        };

        containerinfo.ExposedPorts[`${port}/tcp`] = {};
        containerinfo.Hostconfig.PortBindings[`${port}/tcp`] = [{"HostPort": `${port}`}];

        docker.createContainer(
          containerinfo,
          (err) => {

            // Checks if there was an error creating the container.

            if (err) {
              return res.send(
                {
                  error: "An error has occured when creating the container.",
                  dockererror: err
                }
              );
            }

            // Get the container.

            let container = docker.getContainer(id);

            // Send success message.
  
            res.send(
              {
                error: "none",
                container: container
              }
            );
          }
        );
      };
      docker.modem.followProgress(stream, onFinished);
    });
  });
};