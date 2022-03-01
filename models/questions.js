const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      options: [{ type: String, required: true }],
      correct: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Question", questionSchema);
