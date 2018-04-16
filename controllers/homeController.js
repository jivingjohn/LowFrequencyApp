var request = require('request-json');

var async = require('async');

// Display home page
exports.home_page = function(req, res) {
  res.render('home_page', { title: 'Low Frequency App' });
  return;
};
