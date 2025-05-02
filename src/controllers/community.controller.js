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
exports.getCommunityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const community = await Community.findById(id).populate("createdBy", "username");
    if (!community) {
      throw new CustomError(status.NOT_FOUND, "Community not found");
    }
    res.status(status.OK).json({ community });
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

