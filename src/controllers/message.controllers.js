const express = require('express');
const User = require('../models/user.model'); 
const Message = require('../models/message.model');

exports.getMessagesByCommunityId = async (req, res) => {
    try {
      const communityId = parseInt(req.params.communityId, 10);
  
      if (isNaN(communityId)) {
        return res.status(400).json({ error: 'Invalid community ID' });
      }
  
      const messages = await Message.find({ communityId })
        .sort({ createdAt: 1 }) // oldest to newest
        .populate('senderId', 'username'); // Assuming User model has username field
  
      res.json(messages);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error while fetching messages' });
    }
  }

  exports.createMessage = async (req, res) => {
    try {
      const { communityId } = req.params;
      const { senderId, content } = req.body;
      
      console.log(`Received request: communityId: ${communityId}, senderId: ${senderId}, content: ${content}`);
  
      // Validate the communityId and senderId
      if (isNaN(parseInt(communityId, 10))) {
        return res.status(400).json({ error: 'Invalid community ID' });
      }
  
      if (!senderId || !content) {
        return res.status(400).json({ error: 'Sender ID and message content are required' });
      }
  
      // Check if senderId exists in the User collection
      const user = await User.findById(senderId);
      if (!user) {
        console.log(`User not found: ${senderId}`);
        return res.status(404).json({ error: 'Sender not found' });
      }
  
      const newMessage = new Message({
        communityId: parseInt(communityId, 10),
        senderId,
        content,
      });
  
      await newMessage.save();
  
      console.log(`Message saved: ${newMessage}`);
      res.status(200).json({ message: 'Message created successfully', newMessage });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error while creating message' });
    }
  };
  
