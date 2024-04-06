import mongoose from "mongoose";

const twitterDataModel = new mongoose.Schema({
  oauth_token: {
    type: String,
    required: true,
  },
  oauth_token_secret: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  screen_name: {
    type: String,
    required: true,
  },
});

export const TwitterDataModel =
  mongoose.models.twitterDataModel ||
  mongoose.model("twitterDataModel", twitterDataModel);
