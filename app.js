var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var logger = require('./logger');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });

app.use(logger);
app.use(express.static('public'));

var blocks = {
  user: 'Hello user',
  wall: 'Many posts'
};

app.param('name', function (req, res, next) {
  req.blockName = req.params.name;
  next();
});

app.route('/blocks/:name')
  .post(parseUrlencoded, function (req, res) {
    var newBlock = req.body;
    var key = req.blockName;
    blocks[key] = newBlock[key];
    res.sendStatus(201);
  })

  .get(function (req, res) {
    var value = blocks[req.blockName];

    if (value) {
      res.send(value);
    } else {
      res.status(404).json('Not found ' + req.url);
    }
  })

  .delete(function (req, res) {
    delete blocks[req.blockName];
    res.sendStatus(200);
  });

app.get('/blocks', function (req, res) {
  res.status(200).json(blocks);
});

app.listen(port, function () {
  console.log(`The server is running on *:${port}.`);
});
