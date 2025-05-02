const mongoose = require("mongoose");
const Counter = require("./counter.model"); // Import the Counter model

const communitySchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook to increment the id before saving the community
communitySchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      // Get the latest counter value for the 'Community' model
      const counter = await Counter.findOneAndUpdate(
        { modelName: "Community" },
        { $inc: { sequenceValue: 1 } },
        { new: true, upsert: true }
      );

      // Set the community id to the next sequence value
      this.id = counter.sequenceValue;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const Community = mongoose.model("Community", communitySchema);

module.exports = Community;
