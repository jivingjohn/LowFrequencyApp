const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var Class = require('../models/class');
var Word = require('../models/word');

var async = require('async');

// Display list of all Classes.
exports.class_list = function(req, res) {
  Class.find({}, 'class')
  .exec(function (err, list_classes) {
    if (err) { return next(err); }
    //Successful, so render
    res.render('class_list', { title: 'Class List', class_list: list_classes });
  });
};

// Display detail page for a specific Class.
exports.class_detail = function(req, res) {
  async.parallel({
      detail: function(callback) {
          Class.findById(req.params.id)
            .exec(callback);
      },

      class_words: function(callback) {
        Word.find({ 'class': req.params.id })
        .exec(callback);
      },

  }, function(err, results) {
      if (err) { return next(err); }
      if (results.detail==null) { // No results.
          var err = new Error('Class not found');
          err.status = 404;
          return next(err);
      }

      // Successful, so render
      res.render('class_detail', { title: 'Class Detail', detail: results.detail, class_words: results.class_words } );
  });
};
