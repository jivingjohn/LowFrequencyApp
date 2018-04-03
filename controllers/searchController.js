const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var Class = require('../models/class');
var Word = require('../models/word');

var request = require('request-json');

var wtf = require('wtf_wikipedia');

var async = require('async');

// POST: Search
exports.search = [
  // Validate that the search_terms field is not empty.
  body('search_terms', 'You need to search for something').isLength({ min: 1 }).trim(),
  // Sanitize (trim and escape) the name field.
  sanitizeBody('search_terms').trim(),

  // Process request after validation and sanitization.
  (req, res, next) => {

      // Extract the validation errors from a request.
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
          // There are errors. Render the form again with sanitized values/error messages.
          async.parallel({
            class_count: function(callback) {
                Class.count({}, callback); // Pass an empty object as match condition to find all documents of this collection
            },
            word_count: function(callback) {
                Word.count({}, callback);
            },
          }, function(err, results) {
            res.render('home_page', { title: 'Low Frequency App', errors: errors.array(), classes: results.classes, data: results });
          });
      return;
      }
      else {
        // Split up the search terms
        var search_terms = req.body.search_terms.split(' ');
        var classes;

        // get the info for the classes dropdown again
        async.parallel({
          classes: function(callback) {
              Class.find(callback);
          },
        }, function(err, results) {
          classes = results.classes;
        });

        var wikiSearch = 'https://en.wikipedia.org/w/api.php?format=json&utf8=&action=query&list=search&srsearch=';

        // Add each searchterm with %20 inbetween
        search_terms.forEach(function(term) {
          wikiSearch += term;
          wikiSearch += '%20';
        });
        // take off the last %20
        wikiSearch = wikiSearch.replace(/%20$/g, '');

        // Wikipedia search
        var client = request.createClient(wikiSearch);
        client.get('',function(err, result, body) {
          // format of body is now
          // body { query { search { title: value, pageid: value } } }
          // for our dropdown list

          var search_results = body.query.search;

          res.render('refine_search', { title: 'Wikipedia Articles', search_terms: search_terms, search_results: search_results, classes: classes });
          //return console.log(body);
        });
      }
  }
];

// POST : refine_search
exports.get_frequency = [
  // Validate that the search_terms field is not empty.
  body('selected_result', 'You must select an article').isLength({ min: 1 }).trim(),
  body('selected_class', 'You must select a class').isLength({ min: 1 }).trim(),
  // Sanitize (trim and escape) the name field.
  sanitizeBody('selected_result').trim(),
  sanitizeBody('selected_class').trim(),

  // Process request after validation and sanitization.
  (req, res, next) => {

      // Extract the validation errors from a request.
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
          // There are errors. Render the form again with sanitized values/error messages.
          async.parallel({
            class_count: function(callback) {
                Class.count({}, callback); // Pass an empty object as match condition to find all documents of this collection
            },
            word_count: function(callback) {
                Word.count({}, callback);
            },
          }, function(err, results) {
            res.render('home_page', { title: 'Low Frequency App', errors: errors.array(), classes: results.classes, data: results });
          });
      return;
      }
      else {
        // req.body.search_result
        var selected_result = req.body.selected_result; // id of wiki article
        var selected_class = req.body.selected_class; // id of class we want

        var wikiPage = 'https://en.wikipedia.org/w/api.php?format=json&utf8=&action=query&prop=revisions&rvprop=content&pageids=' + selected_result;

        // Wikipedia search
        var client = request.createClient(wikiPage);
        client.get('',function(err, result, body) {
          // format of body is now
          // body body.query.pages[selected_result].revisions[0]['*']

          // Convert to plaintext
          var plaintext = wtf.plaintext(body.query.pages[selected_result].revisions[0]['*']);
          // Get sentences from plaintext
          var sentences = plaintext.match( /[^\.!\?]+[\.!\?]+/g );

          // Get the words from our catgory into an array

          // Pull out sentences that contain words from our category
          async.parallel({
            class: function(callback){
              Class.findById(selected_class,callback)
            },
            words: function(callback) {
              Word.find({ 'class': selected_class },callback)
            }
          }, function(err, results) {
            var _class = results.class;
            // Have all the words for our class
            var words = results.words;

            // create new array with json storing:
            // {word: word, matches: [{sentence: sentence},...,{sentence: sentence}]}
            var matches = [];

            words.forEach(function(word) {
              var word_matches = [];
              sentences.forEach(function(sentence){
                if (sentence.includes(word.word)) {
                    word_matches.push({ 'sentence': sentence });
                  }
              });
              matches.push({ 'word': word, 'number_matches': word_matches.length, 'matches': word_matches });
            });
            // Create final results including the class
            // {class:class,word_matches: [{word: matches},...,{word: matches}]}
            var results = {'class': _class, 'word_matches': matches };

            res.render('matches', { title: 'Search results for', 'results': results });
          });
        });
      }
  }
];


// function match(word,sentence,cb) {
//   // return the sentence if it contains the word
//   if (sentence.includes(word)) {
//     cb(null, sentence);
//   }
//   cb(null,null);
// }
