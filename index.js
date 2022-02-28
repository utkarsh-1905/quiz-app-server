if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
// const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const Question = require("./models/questions");

const dbUrl = process.env.DB_URL;
// || "mongodb://localhost:27017/QuizApp";
const connectDB = async () => {
  await mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
connectDB()
  .then(() => console.log("Connected to Database"))
  .catch((e) => console.log(e));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.post("/start", (req, res) => {
  // const {data} = req.body;
  console.log(req.body);
  const data = req.body;
  switch (data.type) {
    case "react":
      res.redirect(`/react?questions=${data.number}`);
      break;
    case "cpp":
      res.redirect(`/cpp?questions=${data.number}`);
      break;
    case "js":
      res.redirect(`/js?questions=${data.number}`);
      break;
    case "html":
      res.redirect(`/html?questions=${data.number}`);
      break;
    case "css":
      res.redirect(`/css?questions=${data.number}`);
      break;
    default:
      res.json({ status: "invalid" });
  }
});

app.get("/react", async (req, res) => {
  const numberOfQuestions = req.query.questions;
  const questions = await Question.findOne({ category: "react" });
  let questionArray = [];
  const sendQues = () => {
    for (let i = 0; i < numberOfQuestions; i++) {
      let rand = Math.floor(Math.random() * questions.questions.length);
      questionArray.push(questions.questions[0]);
      questions.questions.filter((_, index) => index !== rand);
    }
    return questionArray;
  };
  res.json({
    total: questions.questions.length,
    questions: [...sendQues()],
  });
});
app.get("/cpp", async (req, res) => {
  const numberOfQuestions = req.query.questions;
  const questions = await Question.find({ category: "cpp" });
  let questionArray = [];
  const sendQues = () => {
    for (let i = 0; i < numberOfQuestions; i++) {
      let rand = Math.floor(Math.random() * questions.questions.length);
      questionArray.push(questions[rand]);
      questions.questions.filter((_, index) => index !== rand);
    }
    return questionArray;
  };
  res.json({
    total: questions.total,
    questions: [...sendQues()],
  });
});
app.get("/js", async (req, res) => {
  const numberOfQuestions = req.query.questions;
  const questions = await Question.find({ category: "js" });
  let questionArray = [];
  const sendQues = () => {
    for (let i = 0; i < numberOfQuestions; i++) {
      let rand = Math.floor(Math.random() * questions.questions.length);
      questionArray.push(questions[rand]);
      questions.questions.filter((_, index) => index !== rand);
    }
    return questionArray;
  };
  res.json({
    total: questions.total,
    questions: [...sendQues()],
  });
});
app.get("/html", async (req, res) => {
  const numberOfQuestions = req.query.questions;
  const questions = await Question.find({ category: "html" });
  let questionArray = [];
  const sendQues = () => {
    for (let i = 0; i < numberOfQuestions; i++) {
      let rand = Math.floor(Math.random() * questions.questions.length);
      questionArray.push(questions[rand]);
      questions.questions.filter((_, index) => index !== rand);
    }
    return questionArray;
  };
  res.json({
    total: questions.total,
    questions: [...sendQues()],
  });
});
app.get("/css", async (req, res) => {
  const numberOfQuestions = req.query.questions;
  const questions = Question.find({ category: "css" });
  let questionArray = [];
  const sendQues = () => {
    for (let i = 0; i < numberOfQuestions; i++) {
      let rand = Math.floor(Math.random() * questions.questions.length);
      questionArray.push(questions[rand]);
      questions.questions.filter((_, index) => index !== rand);
    }
    return questionArray;
  };
  res.json({
    total: questions.total,
    questions: [...sendQues()],
  });
});

app.post("/add/:type", async (req, res) => {
  const type = req.params.type;
  const data = req.body;
  const options = [data.optn1, data.optn2, data.optn3, data.optn4];
  const newQuestions = new Question({
    category: type,
    questions: [
      {
        question: data.question,
        options: [...options],
      },
    ],
  });
  await newQuestions.save();
  res.status(200).send("Questions added and category created");
});

app.put("/create/:type", async (req, res) => {
  const type = req.params.type;
  const data = req.body;
  console.log(data.question.length);
  const options = [data.optn1, data.optn2, data.optn3, data.optn4];
  const question = await Question.findOne({ category: type });
  if ((question && data, question.length)) {
    question.questions.push({
      question: data.question,
      options: [...options],
    });
    await question.save();
    res.status(200).send("Questions added");
  } else {
    res.status(404).send("Category not found");
  }
});

app.all("*", (req, res) => {
  console.log("Bad request");
  res.send("404 not found!!").json({ status: "invalid" });
});

app.listen(process.env.PORT || 3005, () => console.log("Server started"));
