if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
// const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const nodemailer = require("nodemailer");
// const asyncError = require("./utils/asyncError");
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

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASS,
  },
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("combined"));
app.use(helmet());

app.post("/start", (req, res) => {
  // const {data} = req.body;
  try {
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
  } catch (e) {
    console.log(e);
  }
});

app.get("/react", async (req, res) => {
  try {
    const numberOfQuestions = req.query.questions;
    const questions = await Question.findOne({ category: "react" });
    if (Object.keys(questions).length !== 0) {
      let questionArray = [];
      const sendQues = () => {
        for (let i = 0; i < numberOfQuestions; i++) {
          let rand = Math.floor(Math.random() * questions.questions.length);
          questionArray.push(questions.questions[rand]);
          questions.questions.filter((_, index) => index !== rand);
        }
        return questionArray;
      };
      res.json({
        total: questions.questions.length,
        questions: [...sendQues()],
      });
    } else {
      res.json({
        total: 0,
        questions: [],
      });
    }
  } catch (e) {
    console.log(e);
  }
});
app.get("/cpp", async (req, res) => {
  try {
    const numberOfQuestions = req.query.questions;
    const questions = await Question.find({ category: "cpp" });
    if (Object.keys(questions).length !== 0) {
      let questionArray = [];
      const sendQues = () => {
        for (let i = 0; i < numberOfQuestions; i++) {
          let rand = Math.floor(Math.random() * questions.questions.length);
          questionArray.push(questions.questions[rand]);
          questions.questions.filter((_, index) => index !== rand);
        }
        return questionArray;
      };
      res.json({
        total: questions.total,
        questions: [...sendQues()],
      });
    } else {
      res.json({
        total: 0,
        questions: [],
      });
    }
  } catch (e) {
    console.log(e);
  }
});
app.get("/js", async (req, res) => {
  try {
    const numberOfQuestions = req.query.questions;
    const questions = await Question.find({ category: "js" });
    if (Object.keys(questions).length !== 0) {
      let questionArray = [];
      const sendQues = () => {
        for (let i = 0; i < numberOfQuestions; i++) {
          let rand = Math.floor(Math.random() * questions.questions.length);
          questionArray.push(questions.questions[rand]);
          questions.questions.filter((_, index) => index !== rand);
        }
        return questionArray;
      };
      res.json({
        total: questions.total,
        questions: [...sendQues()],
      });
    } else {
      res.json({
        total: 0,
        questions: [],
      });
    }
  } catch (e) {
    console.log(e);
  }
});
app.get("/html", async (req, res) => {
  try {
    const numberOfQuestions = req.query.questions;
    const questions = await Question.find({ category: "html" });
    if (Object.keys(questions).length !== 0) {
      let questionArray = [];
      const sendQues = () => {
        for (let i = 0; i < numberOfQuestions; i++) {
          let rand = Math.floor(Math.random() * questions.questions.length);
          questionArray.push(questions.questions[rand]);
          questions.questions.filter((_, index) => index !== rand);
        }
        return questionArray;
      };
      res.json({
        total: questions.total,
        questions: [...sendQues()],
      });
    } else {
      res.json({
        total: 0,
        questions: [],
      });
    }
  } catch (e) {
    console.log(e);
  }
});
app.get("/css", async (req, res) => {
  try {
    const numberOfQuestions = req.query.questions;
    const questions = Question.find({ category: "css" });
    if (Object.keys(questions).length !== 0) {
      let questionArray = [];
      const sendQues = () => {
        for (let i = 0; i < numberOfQuestions; i++) {
          let rand = Math.floor(Math.random() * questions.questions.length);
          questionArray.push(questions.questions[rand]);
          questions.questions.filter((_, index) => index !== rand);
        }
        return questionArray;
      };
      res.json({
        total: questions.total,
        questions: [...sendQues()],
      });
    } else {
      res.json({
        total: 0,
        questions: [],
      });
    }
  } catch (e) {
    console.log(e);
  }
});

app.post("/add/:type", async (req, res) => {
  const type = req.params.type;
  const data = req.body;
  const options = [data.optn1, data.optn2, data.optn3, data.optn4];
  const correct = data.correct;
  const newQuestions = new Question({
    category: type,
    questions: [
      {
        question: data.question,
        options: [...options],
        correct: correct,
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
  const correct = data.correct;
  const question = await Question.findOne({ category: type });
  if (question && data) {
    question.questions.push({
      question: data.question,
      options: [...options],
      correct: correct,
    });
    await question.save();
    res.status(200).send("Questions added");
  } else {
    res.status(404).send("Category not found");
  }
});

app.post("/score", async (req, res) => {
  const { score, type, mailID } = req.body;
  await transporter
    .sendMail({
      from: `"Utkarsh" <utripathi_be21@thapar.edu>`,
      to: mailID,
      subject: "Your Score at out quiz!!",
      html: `<h1>Your Scored ${score} in our ${type} quiz!!</h1>
      <p>Thank you for participating in our quiz.</p>
      <p>We hope you enjoyed the quiz.</p>
      <p>Please Share with your friends.</p>
      <p>Regards</p>
      `,
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ res: "Error in sending mail" });
    });
  res.status(200).json({ res: "Mail sent" });
});

app.delete("/deleteAll", async (req, res) => {
  const pass = req.query.password;
  if (pass == "deleteeverything") {
    await Question.deleteMany({});
    res.json({ status: "deleted all" });
  } else {
    res.json({ status: "wrong password" });
  }
});

app.all("*", (req, res) => {
  console.log("Bad request");
  res.send("404 not found!!").json({ status: "invalid" });
});

app.listen(process.env.PORT || 3005, () => console.log("Server started"));
