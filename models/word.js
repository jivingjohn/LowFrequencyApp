var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var WordSchema = new Schema(
  {
    word: {type: String, required: true},
    class: {type: Schema.ObjectId, ref: 'Class', required: true},
    frequency: {type: Number, required: true},
  }
);

// Virtual for book's URL
WordSchema
.virtual('url')
.get(function () {
  return '/lowfrequencyapp/word/' + this._id;
});

//Export model
module.exports = mongoose.model('Word', WordSchema);
