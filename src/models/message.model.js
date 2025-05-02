// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  communityId: {
    type: Number, // Use the same numeric type as communityId from the Community model
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming User model exists
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true, // adds createdAt and updatedAt
});

module.exports = mongoose.model('Message', messageSchema);
