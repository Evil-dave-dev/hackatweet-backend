const mongoose = require("mongoose");

const tweetSchema = mongoose.Schema({
  message: String,
  trend: String,
  date: Date,
  user: {type : mongoose.Schema.Types.ObjectId, ref: 'users'},
  like: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}]
});

const Tweet = mongoose.model("tweets", tweetSchema);

module.exports = Tweet;