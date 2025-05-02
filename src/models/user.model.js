const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const toJson = require("@meanie/mongoose-to-json");
const CustomError = require("../utils/customError");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong enough");
        }
      },
    },

    profileImageUrl: {
      type: String,
      default: "",
    },
    point: {
      type: Number,
      default: 0,
    },
    googleId: {
      type: String,
      default: null,
    },
    
    about:{
      type: String,
      default: null,
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

userSchema.statics.isEmailTaken = async function (email) {
  const user = await this.findOne({ email });
  return !!user;
};

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch;
};

userSchema.plugin(toJson);

const User = mongoose.model("User", userSchema);
module.exports = User;
