// Get an array of words from a sentence with no punctuation
var getWords = function(sentence) {
  return sentence
    .toLowerCase() // make everything lowercase
    .replace(/[0-9]/g, '') // remove any numbers from our words
    .replace(/[.,?!\:;()"'-]/g, ' ') // get rid of punctuation
    .replace(/\s+/g, ' ') // remove whitespace
    .trim() // remove anything else
    .split(' '); // split on space
}

// Count the words in a sentence
var individualWords = function (sentence) {
  var index = [],
      words = getWords(sentence);

  words.forEach(function (word) {
      word = word.toLowerCase(); // lowercase the word to match
      if (index.indexOf(word) < 0) {
          index.push(word);
      }
  });
  // returns [ word1, word2 ... wordx ]
  // words are all lowercase
  return index;
}

// show if a sentence contains a word
var containsWord = function(sentence,word) {
  word = word.toLowerCase(); // lowercase word to check
  var words = getWords(sentence);

  return ( words.indexOf(word) > -1 );
  // if ( words.indexOf(word) > -1 ) {
  //   return true;
  // }
  // return false;
}

var matchWords = function (sentences) {
  var matches = [];

  // stick all sentences together with a space
  var one_sentence = sentences.join(' ');

  // Get the distinct words in our document
  var words = individualWords(one_sentence); //{ word1:#, word2:# }

  // Get sentences that contain each word
  words.forEach(function(word) {
    var word_matches = [];
    sentences.forEach(function(sentence) {
      if (containsWord(sentence, word)) {
        word_matches.push({ 'sentence': sentence });
      }
    });
    matches.push({ 'word' : { 'word' : word }, 'number_matches': word_matches.length, 'matches': word_matches });
  });
  // Create final results including the class
  // {class:class,word_matches: [{word: matches},...,{word: matches}]}
  return {'word_matches': matches };
}

module.exports.IndividualWords = individualWords;
module.exports.GetWords = getWords;
module.exports.ContainsWord = containsWord;
module.exports.MatchWords = matchWords;
