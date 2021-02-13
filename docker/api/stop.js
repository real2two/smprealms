module.exports.load = async function(app, docker) {
  app.post("/stop/:id", async (req, res) => {

    // Set the id variable.

    let id = req.params.id;

    // Gets and stops the container.

    let container = docker.getContainer(id);
    container.stop((err) => {
      if (err) {
        return res.send({
          error: "An error has occured when attempting to stop the container."
        });
      }
      
      res.send({
        error: "none"
      });
      
    });
  });
};