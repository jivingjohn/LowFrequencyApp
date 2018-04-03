var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ClassSchema = new Schema(
  {
    class: {type: String, required: true, max: 100},
  }
);

// Virtual for author's URL
ClassSchema
.virtual('url')
.get(function () {
  return '/lowfrequencyapp/class/' + this._id;
});

//Export model
module.exports = mongoose.model('Class', ClassSchema);
