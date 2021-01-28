const mongoose = require('mongoose');
const Question = require('./Question');
const User = require('./User');

const Schema = mongoose.Schema;

const KahootSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true,
    default: 'https://source.unsplash.com/random'
  },
  description: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  listQuestion:
    {
      type: [Object],
      require: true
    }
}, { timestamps: true });

const Kahoot = mongoose.model('Kahoot', KahootSchema);

module.exports = Kahoot;


