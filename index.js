const express = require('express');
const app = express();
const PORT = precess.env.PORT;

app.get("/", (req, res) => {
  res.send({ hello: "world" });
});

app.listen(PORT);