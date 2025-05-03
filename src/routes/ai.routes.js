const express = require("express");
const router = express.Router();
const chatController = require("../controllers/aiChat.controller");

// Pass user_id in URL params
router.post("/send/:userId", chatController.sendMessageToAI);  // Send message to AI and save to DB
router.get("/history/:userId", chatController.getChatHistory); // Get chat history

module.exports = router;
