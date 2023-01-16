require("dotenv").config();
require("express-async-errors");

//server
const express = require("express");
const server = express();

//rest of the packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

//database
const connectDB = require("./db/connect");

//routes
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");

//middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

server.use(morgan("tiny"));
server.use(express.json());
server.use(cookieParser(process.env.JWT_SECRET));

const port = process.env.PORT || 5000;

server.get("/api/v1", (req, res) => {
  // console.log(req.cookies);
  console.log(req.signedCookies);
  res.send("e-commerce api");
});

server.use("/api/v1/auth", authRouter);
server.use("/api/v1/users", userRouter);

server.use(notFoundMiddleware);
server.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    server.listen(port, console.log(`server is listening to port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
