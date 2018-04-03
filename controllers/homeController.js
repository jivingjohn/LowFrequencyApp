const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var Class = require('../models/class');
var Word = require('../models/word');

var request = require('request-json');

var async = require('async');

// Display home page
exports.home_page = function(req, res) {
  async.parallel({
    class_count: function(callback) {
        Class.count({}, callback); // Pass an empty object as match condition to find all documents of this collection
    },
    word_count: function(callback) {
        Word.count({}, callback);
    },
  }, function(err, results) {
    res.render('home_page', { title: 'Low Frequency App', errors: err, data: results });
  });
};
