/**
 * Module dependencies.
 */
var express = require('express'), //eslint-disable-line
  fs = require('fs'),
  passport = require('passport'),
  logger = require('mean-logger'),
  io = require('socket.io');
require('dotenv').config();

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Load configurations
// if test env, load example file
var env = process.env.NODE_ENV || 'development', //eslint-disable-line
  config = require('./config/config'),
  auth = require('./config/middlewares/authorization'),
  mongoose = require('mongoose');

// Bootstrap db connection
if (env !== 'test') {
  mongoose.connect(config.db);
} else {
  mongoose.connect(process.env.CFH_TESTDB);
}


// Bootstrap models
var modelsPath = `${__dirname}/app/models`; //eslint-disable-line
var walk = function (path) { //eslint-disable-line
  fs.readdirSync(path).forEach((file) => {
    var newPath = `${path}/${file}`; //eslint-disable-line
    var stat = fs.statSync(newPath); //eslint-disable-line
    if (stat.isFile()) {
      if (/(.*)\.(js|coffee)/.test(file)) {
        require(newPath); //eslint-disable-line
      }
    } else if (stat.isDirectory()) {
      walk(newPath);
    }
  });
};
walk(modelsPath);

// bootstrap passport config
require('./config/passport')(passport);

var app = express(); //eslint-disable-line

// express settings
require('./config/express')(app, passport, mongoose);

// Bootstrap routes
require('./config/routes')(app, passport, auth);

// Start the app by listening on <port>
var port = process.env.PORT || 3000; //eslint-disable-line
var server = app.listen(port); //eslint-disable-line
var ioObj = io.listen(server, { log: false }); //eslint-disable-line

// game logic handled here
require('./config/socket/socket')(ioObj);

console.log(`Express app started on port ${port}`); //eslint-disable-line

// Initializing logger
logger.init(app, passport, mongoose);

// expose app
export default app;
