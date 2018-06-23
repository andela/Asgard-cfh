/**
 * Module dependencies.
 */
var mongoose = require('mongoose'), //eslint-disable-line
    async = require('async'), //eslint-disable-line
    _ = require('underscore'); //eslint-disable-line


// Redirect users to /#!/app (forcing Angular to reload the page)
exports.play = function(req, res) { //eslint-disable-line
  if (Object.keys(req.query)[0] === 'custom') {
    res.redirect('/#!/app?custom');
  } else {
    res.redirect('/#!/app');
  }
};

exports.render = function(req, res) { //eslint-disable-line
  res.render('index', {
    user: req.user ? JSON.stringify(req.user) : 'null'
  });
};
