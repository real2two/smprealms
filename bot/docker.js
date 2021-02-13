const fetch = require("node-fetch");

async function checkCode(domain, token) {
  let fetched = await fetch(
    domain + "/",
    {
      method: "get",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
  );
  try {
    return fetched.json();
  } catch(err) {
    return null;
  }
};

exports.checkCode = checkCode;

async function createServer(domain, token, port) {
  let fetched = await fetch(
    domain + "/create",
    {
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        port: port
      })
    }
  );
  try {
    return fetched.json();
  } catch(err) {
    return null;
  }
};

exports.createServer = createServer;

async function deleteServer(domain, token, id) {
  let fetched = await fetch(
    domain + "/delete/" + id,
    {
      method: "delete",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
  );
  try {
    return fetched.json();
  } catch(err) {
    return null;
  }
};

exports.deleteServer = deleteServer;

async function listServers(domain, token) {
  let fetched = await fetch(
    domain + "/list",
    {
      method: "get",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
  );
  try {
    return fetched.json();
  } catch(err) {
    return null;
  }
};

exports.listServers = listServers;

async function startServer(domain, token, id) {
  let fetched = await fetch(
    domain + "/start/" + id,
    {
      method: "post",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
  );
  try {
    return fetched.json();
  } catch(err) {
    return null;
  }
};

exports.startServer = startServer;

async function stopServer(domain, token, id) {
  let fetched = await fetch(
    domain + "/stop/" + id,
    {
      method: "post",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
  );
  try {
    return fetched.json();
  } catch(err) {
    return null;
  }
};

exports.stopServer = stopServer;

async function killServer(domain, token, id) {
  let fetched = await fetch(
    domain + "/kill/" + id,
    {
      method: "post",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
  );
  try {
    return fetched.json();
  } catch(err) {
    return null;
  }
};

exports.killServer = killServer;

async function generateDownload(domain, token, id) {
  let fetched = await fetch(
    domain + "/generatedownload/" + id,
    {
      method: "post",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
  );
  try {
    return fetched.json();
  } catch(err) {
    return null;
  }
};

exports.generateDownload = generateDownload;

async function whitelist(domain, token, id) {
  let fetched = await fetch(
    domain + "/whitelist/" + id,
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  try {
    return fetched.json();
  } catch(err) {
    return null;
  }
};

exports.whitelist = whitelist;

async function whitelistSet(domain, token, id, usernames) {
  let fetched = await fetch(
    domain + "/whitelist/" + id,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": 'application/json'
      },
      // for some reason, the body outputs "{}" to the backend, instead of this
      body: JSON.stringify(
        {
          usernames: usernames
        }
      )
    }
  );
  try {
    return await fetched.json();
  } catch(err) {
    return null;
  }
};

exports.whitelistSet = whitelistSet;