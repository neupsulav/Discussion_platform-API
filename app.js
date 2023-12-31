const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./db/connect");
const errorHandlerMiddleware = require("./middlewares/ErrorHandlerMiddleware");
const noRoute = require("./middlewares/noRoute");
const authRouter = require("./routers/auth");
const postRouter = require("./routers/post");
const profileRouter = require("./routers/profile");
const followRouter = require("./routers/follow");
const usersRouter = require("./routers/user");

//routes
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/profile", profileRouter);
app.use("/api/", followRouter);
app.use("/api/user", usersRouter);

//middlewares

//error handler middleware
app.use(errorHandlerMiddleware);

//no route
app.use(noRoute);

//listen
const listen = async () => {
  await connectDB(process.env.MONGO_URI);

  app.listen(process.env.PORT, () => {
    console.log(`Server is listening to port no ${process.env.PORT}`);
  });
};

listen();
