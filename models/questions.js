const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  category: String,
  questions: [
    {
      question: String,
      options: [String],
    },
  ],
  // maxScore: Number,
  // avgScore: Number,
});

module.exports = mongoose.model("Question", questionSchema);
