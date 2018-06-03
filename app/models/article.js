/**
 * Module dependencies.
 */
const mongoose = require('mongoose'),
  { Schema } = mongoose;

/**
 * Article Schema
 */
const ArticleSchema = new Schema({
  id: {
    type: Number
  },
  title: {
    type: String,
    default: null,
    trim: true,
    required: true
  },
  content: {
    type: String,
    default: '',
    trim: ''
  },
  user: {
    type: String,
    default: '',
    trim: true
  }
});

/**
 * Statics
 */
ArticleSchema.statics = {
  load(id, cb) {
    this.findOne({
      id
    }).select('-_id').exec(cb);
  }
};

mongoose.model('Article', ArticleSchema);
