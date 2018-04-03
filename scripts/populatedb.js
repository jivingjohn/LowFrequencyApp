#! /usr/bin/env node

console.log('Start of Script');

var async = require('async')
var Class = require('../models/class')
var Word = require('../models/word')

var mongoose = require('mongoose');
var mongoDB = 'mongodb://127.0.0.1:27017/express-LowFrequencyApp';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// List of the classes to create
var classes = [
  'nouns',
  'verbs',
  'adjectives',
  'adverbs',
  'pronouns',
  'determiners',
  'determiner/pronouns',
  'prepositions',
  'conjunctions',
  'interjections and discourse particles',
];

// read words files
const lineReader = require('readline');
const wordfiles = './wordfiles/';
var fs = require('fs');

var createdclasses = [];

function classCreate(_class, cb) {
  classdetail = { class: _class };

  var _class = new Class(classdetail);

  _class.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Class: ' + _class);
    createdclasses.push(_class)
    cb(null, _class)
  }  );
}

function wordCreate(_class, _word, _frequency, cb) {

  worddetail = {class:_class, word:_word, frequency: _frequency }

  var _word = new Word(worddetail);

  _word.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New word: ' + _word);
    cb(null, _word)
  }  );
}

function wordsFromWordFile(_class, cb){
  var _wordfile = _class.replace(/ /g,'_').replace(/\//g,'_-_');
  var classIndex = classes.indexOf(_class);
  var _class = createdclasses[classIndex];
  var fileStream = '../wordfiles/' + _wordfile;
  var lineToRead = lineReader.createInterface({
    input: fs.createReadStream(fileStream)
  });

  lineToRead.on('line', function (line, cb) {
    var data = line.split('\t');
    var _word = data[0];
    var _frequency = data[1];
    wordCreate(_class, _word, _frequency, cb);
  });
}

function seedClasses(cb) {
  async.map(classes, classCreate, cb);
}

function seedWords(cb) {
  async.map(classes, wordsFromWordFile, cb);
}

async.series([
    seedClasses,
    seedWords
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Finished');
    }
    // All done, disconnect from database
    mongoose.connection.close();
});

// Need to sort out what's not working with callback on seedWords
