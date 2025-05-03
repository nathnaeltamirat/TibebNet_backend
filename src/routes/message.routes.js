// routes/messages.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controllers');
const Message = require('../models/message.model');

// GET /api/messages/:communityId
router.get('/:communityId',messageController.getMessagesByCommunityId);
router.post('/:communityId', messageController.createMessage);
// DELETE all messages
router.delete('/', async (req, res) => {
    try {
      await Message.deleteMany({});
      res.json({ message: 'All messages deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
  
module.exports = router;
