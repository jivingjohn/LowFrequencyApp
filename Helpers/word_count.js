// Get an array of words from a sentence with no punctuation
var getWords = function(sentence) {
  return sentence
    .replace(/[0-9]/g, "") // remove any numbers from our words
    .replace(/[.,?!\:;()"'-]/g, " ") // get rid of punctuation
    .replace(/\s+/g, " ") // remove whitespace
    .trim() // remove anything else
    .split(" "); // split on space
}

// Count the words in a sentence
var countWords = function (sentence) {
  var index = {},
      words = getWords(sentence);
  words.forEach(function (word) {
      if (!(index.hasOwnProperty(word))) {
          index[word] = 0;
      }
      index[word]++;
  });
  //console.log(index);
  // returns { word1:#, word2:# }
  return index;
}

// show if a sentence contains a word
var containsWord = function(sentence,word) {
  var words = getWords(sentence);
  if ( words.indexOf(word) > -1 ) {
    return true;
  }
  return false;
}

var matchWords = function (sentences) {
  var matches = [];

  // stick all sentences together with a space
  var one_sentence = sentences.join(' ');

  // Get the distinct words in our document
  var words = countWords(one_sentence); //{ word1:#, word2:# }

  // Get sentences that contain each word
  Object.keys(words).forEach(function(word) {
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

module.exports.CountWords = countWords;
module.exports.GetWords = getWords;
module.exports.ContainsWord = containsWord;
module.exports.MatchWords = matchWords;
