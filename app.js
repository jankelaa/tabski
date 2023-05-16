const express = require("express");
const cors = require("cors");

const userRouter = require("./routes/user.router");
const postRouter = require("./routes/post.router");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/user", userRouter);
app.use("/post", postRouter);

const PORT = 3000;

app.get("/", (req, res) => {
  res.status(200);
  res.send(`Listening on port ${PORT}`);
});

app.listen(PORT, (error) => {
  if (!error) console.log("Server is running and listening on port " + PORT);
  else console.log("Error occurred, server can't start", error);
});
