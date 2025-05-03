const express = require("express");
const router = express.Router();
const chatController = require("../controllers/aiChat.controller");
const User = require("../models/user.model");
// Pass user_id in URL params
router.post("/send/:userId", chatController.sendMessageToAI);  // Send message to AI and save to DB
router.get("/history/:userId", chatController.getChatHistory); // Get chat history
router.delete('/', async (req, res) => {
    try {
      const users = await User.find({ "chatHistory.sender": "user" });
  
      for (const user of users) {
        user.chatHistory = user.chatHistory.filter(msg => msg.sender !== 'user');
        await user.save();
      }
  
      res.status(200).json({ message: "All AI chat history deleted successfully." });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
module.exports = router;
