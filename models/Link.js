const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  shortCode: {
    type: String,
    required: true,
    unique: true,
    minlength: 6,
    maxlength: 8,
    match: /^[A-Za-z0-9]{6,8}$/
  },
  originalUrl: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        const urlRegex = /^https?:\/\/.+/;
        return urlRegex.test(v);
      },
      message: 'Invalid URL format'
    }
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  clicks: {
    type: Number,
    default: 0
  },
  lastClicked: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Link', linkSchema);