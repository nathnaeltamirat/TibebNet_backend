const express = require("express");
const router = express.Router();
const communityController = require("../controllers/community.controller");
const { protect } = require("../middlewares/auth");  


router.post("/create", protect, communityController.createCommunity);


router.post("/add-member", protect, communityController.addMember);


router.post("/remove-member", protect, communityController.removeMember);

module.exports = router;
