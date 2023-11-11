const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  quote: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
}, { timestamps: true });

const QuoteModel = mongoose.model('Quote', quoteSchema);

module.exports = QuoteModel;
