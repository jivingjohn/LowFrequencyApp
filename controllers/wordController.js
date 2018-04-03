const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var Word = require('../models/word');

var async = require('async');

// Display list of all wordes.
exports.word_list = function(req, res) {
  Word.find({}, 'word')
  .populate('class')
  .exec(function (err, list_words) {
    if (err) { return next(err); }
    //Successful, so render
    res.render('word_list', { title: 'Word List', word_list: list_words });
  });
};

// Display detail page for a specific word.
exports.word_detail = function(req, res) {
  async.parallel({
      word: function(callback) {
          Word.findById(req.params.id)
            .populate('class')
            .exec(callback);
      },
  }, function(err, results) {
      if (err) { return next(err); }
      if (results.word==null) { // No results.
          var err = new Error('Word not found');
          err.status = 404;
          return next(err);
      }
      // Successful, so render
      res.render('word_detail', { title: 'Word Detail', word: results.word } );
  });
};
