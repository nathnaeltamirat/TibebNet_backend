const express = require("express");
const router = express.Router();
const communityController = require("../controllers/community.controller");
const authenticateUser = require("../middlewares/auth");


router.post("/", authenticateUser, communityController.createCommunity);

router.get("/", communityController.getCommunities);

router.get("/:id", communityController.getCommunityById);

router.delete("/:id", authenticateUser, communityController.deleteCommunity);


module.exports = router;
