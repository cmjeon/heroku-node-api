const express = require('express');
const app = express();
const port = precess.env.port;

app.get("/", (req, res) => {
  res.send({ hello: "world" });
});

app.listen(port);