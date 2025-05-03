const User = require("../models/user.model");

exports.sendMessageToAI = async (req, res) => {
  try {
    const { messages } = req.body;  // Get the messages array from the request body
    const userId = req.params.userId; // Get userId from URL params

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Save user message to chat history
    const userMessage = messages.find((msg) => msg.sender === "user");
    const aiMessage = messages.find((msg) => msg.sender === "ai");

    if (userMessage) user.chatHistory.push({ message: userMessage.message, sender: "user" });
    if (aiMessage) user.chatHistory.push({ message: aiMessage.message, sender: "ai" });

    // Save the updated chat history to the database
    await user.save();

    return res.status(200).json({ message: "Messages saved successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong while saving messages." });
  }
};


exports.getChatHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId, "chatHistory");
    return res.json(user.chatHistory);
  } catch (err) {
    return  res.status(500).json({ error: "Could not retrieve chat history." });
  }
};
