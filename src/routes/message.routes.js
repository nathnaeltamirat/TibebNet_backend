// routes/messages.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controllers');


// GET /api/messages/:communityId
router.get('/:communityId',messageController.getMessagesByCommunityId);
router.post('/:communityId', messageController.createMessage);
module.exports = router;
