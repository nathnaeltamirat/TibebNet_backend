const Community = require("../models/community.model");
const { status } = require("http-status");
const CustomError = require("../utils/customError");

exports.createCommunity = async (req, res, next) => {
  const { name, description } = req.body;

  
  const existingCommunity = await Community.findOne({ name });
  if (existingCommunity) {
    return next(new CustomError(status.BAD_REQUEST, "Community already exists"));
  }
  const community = new Community({
    name,
    description,
  });

  await community.save();

  res.status(status.CREATED).json({
    message: "Community created successfully",
    data: community,
  });
};

exports.addMember = async (req, res, next) => {
  const { communityId, userId } = req.body;

  const community = await Community.findById(communityId);
  if (!community) {
    return next(new CustomError(status.NOT_FOUND, "Community not found"));
  }

 
  if (community.members.includes(userId)) {
    return next(new CustomError(status.BAD_REQUEST, "User is already a member"));
  }

  community.members.push(userId);
  await community.save();

  res.status(status.OK).json({
    message: "Member added successfully",
    data: community,
  });
};

exports.removeMember = async (req, res, next) => {
  const { communityId, userId } = req.body;

  
  const community = await Community.findById(communityId);
  if (!community) {
    return next(new CustomError(status.NOT_FOUND, "Community not found"));
  }


  const index = community.members.indexOf(userId);
  if (index === -1) {
    return next(new CustomError(status.BAD_REQUEST, "User not a member"));
  }

  community.members.splice(index, 1);
  await community.save();

  res.status(status.OK).json({
    message: "Member removed successfully",
    data: community,
  });
};
