const Community = require("../models/community.model");
const CustomError = require("../utils/customError");
const {status} = require("http-status");




exports.createCommunity = async (req, res, next) => {
  try {
    const { name, description,image} = req.body;
    const existing = await Community.findOne({ name });
    if (existing) {
      throw new CustomError(status.BAD_REQUEST, "Community already exists");
    }

    const community = await Community.create({
      name,
      description,
      image,
      createdBy: req.user._id,
    });

    res.status(status.CREATED).json({ community });
  } catch (err) {
    next(err);
  }
};

// Get all communities
exports.getCommunities = async (req, res, next) => {
  try {
    const communities = await Community.find({});
    res.status(status.OK).json({ communities });
  } catch (err) {
    next(err);
  }
};

// Get single community by ID
// Example: GET /api/communities/1
exports.getCommunityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id);

    if (isNaN(numericId)) {
      throw new CustomError(400, "Invalid Community ID. Must be a number.");
    }

    const community = await Community.findOne({ id: numericId });
    if (!community) {
      throw new CustomError(404, "Community not found");
    }
    res.status(200).json({ community });
  } catch (err) {
    next(err);
  }
};
exports.deleteCommunity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const community = await Community.findOneAndDelete({ id });
    if (!community) {
      throw new CustomError(status.NOT_FOUND, "Community not found");
    }
    res.status(status.OK).json({ message: "Community deleted successfully" });
  } catch (err) {
    next(err);
  }
}

