const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const wikiURL = 'https://en.wikipedia.org/w/api.php?format=json&utf8=&action=query&',
      wikiImage = wikiURL + 'prop=imageinfo&iiprop=url&titles=';

var WordCount = require('../Helpers/word_count');

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
        res.render('home_page', { title: 'Low Frequency App', errors: errors.array(), classes: results.classes, data: results });
        return;
      }
      else {
        // Split up the search terms
        var search_terms = req.body.search_terms.split(' ');

        var wikiSearch = wikiURL + 'list=search&srsearch=';

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

          res.render('refine_search', { title: 'Wikipedia Articles', search_terms: search_terms, search_results: search_results });
          return;
        });
      }
  }
];

// POST : refine_search
exports.get_frequency = [
  // Validate that the search_terms field is not empty.
  body('selected_result', 'You must select an article').isLength({ min: 1 }).trim(),

  // Sanitize (trim and escape) the name field.
  sanitizeBody('selected_result').trim(),
  // sanitizeBody('selected_class').trim(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render('home_page', { title: 'Low Frequency App', errors: errors.array() });
        return;
    }
    else {
      // req.body.search_result
      var selected_result = req.body.selected_result; // id of wiki article

      var wikiPage = wikiURL + 'prop=revisions&rvprop=content&pageids=' + selected_result;

      // Wikipedia search
      var pageClient = request.createClient(wikiPage);

      getSentences(selected_result,function(err,matches){
        res.render('matches', matches);
        return;
      });
    }
  }
];

var getSentences = function(selected_result, callback) {
  var wikiPage = wikiURL + 'prop=revisions&rvprop=content&pageids=' + selected_result;
  var pageClient = request.createClient(wikiPage);
  pageClient.get('', function (req, result, body) {
    // format of body is now
    // body body.query.pages[selected_result].revisions[0]['*']

    // detail for page
    var title = 'Word frequency within the Wikipedia page for:',
        subtitle = (body.query.pages[selected_result].title),
        sentences;

    // Convert to plaintext
    var plaintext = wtf.plaintext(body.query.pages[selected_result].revisions[0]['*']);
    // Get sentences from plaintext
    sentences = plaintext.match( /[^\.!\?]+[\.!\?]+/g );

    getImages(selected_result, function(err,images) {
      callback(null, { 'title': title, 'subtitle': subtitle, 'results': WordCount.MatchWords(sentences), 'images': images } );
    });
  });
}

var getImages = function(selected_result,callback) {
  var wikiImages = wikiURL + 'prop=images&pageids=' + selected_result;
  var imagesClient = request.createClient(wikiImages);
  imagesClient.get('', function (req,res,body){
    // body now has body.query.pages[pageid].images
    // an array of filenames
    var filenames = body.query.pages[selected_result].images;
    // get the url of the actual image
    //get each image url for images
    var imageURLS = [];
    async.map(filenames, getImage, function(err,result){
      callback(err, result);
    });
  });
}

var getImage = function(filename,callback) {
  // filename.title is what we want
  var imageClient = request.createClient(wikiImage+filename.title);

  imageClient.get('',function(req,res,body){
    var page = body.query.pages;
    // body.query.pages[firstProp].imageinfo[0].url);
    var firstProp;
    for(var key in page) {
      if(page.hasOwnProperty(key)) {
        firstProp = page[key];
        break;
      }
    }

    var url = firstProp.imageinfo[0].url;
    callback(null, url);
  });
}
