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

  const TIBEB_ID = "681663c722fe544dbe03c943"; // Fixed Tibeb ObjectId

  exports.createMessage = async (req, res) => {
    try {
      const { communityId } = req.params;
      let { senderId, content, isFromAI } = req.body;
  
      console.log(`Received request: communityId: ${communityId}, senderId: ${senderId}, content: ${content}, isFromAI: ${isFromAI}`);
  
      if (isNaN(parseInt(communityId, 10))) {
        return res.status(400).json({ error: 'Invalid community ID' });
      }
  
      if (!content) {
        return res.status(400).json({ error: 'Message content is required' });
      }
  
      // If it's from Tibeb AI, override senderId with the fixed ID
      if (isFromAI === true || isFromAI === 'true') {
        senderId = TIBEB_ID;
      }
  
      // Validate senderId unless it's Tibeb
   
        const user = await User.findById(senderId);
        if (!user) {
          console.log(`User not found: ${senderId}`);
          return res.status(404).json({ error: 'Sender not found' });
        }
      
        const newMessage = new Message({
          communityId: parseInt(communityId, 10),
          senderId,
          content,
          isFromAI: req.body.isFromAI || false
        });
        
  
      await newMessage.save();
  
      console.log(`Message saved: ${newMessage}`);
      res.status(200).json({ message: 'Message created successfully', newMessage });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error while creating message' });
    }
  };
  
  
