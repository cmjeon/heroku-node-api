var express = require('express');
var morgan = require('morgan');
var app = express();
const port = process.env.PORT||3000;

var users = [
  {id: 1, name: 'alice'},
  {id: 2, name: 'beck'},
  {id: 3, name: 'chris'},
];

app.use(morgan('dev'));

app.get('/', function(req, res) {
  res.json('Hello!');
  res.status(200).end();
})

app.get('/users', function(req, res) {
  res.json(users);
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}!`);
})

module.exports = app;