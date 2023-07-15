const User = require("../models/user");
const catchAsync = require("./catchAsync");
const ErrorHandler = require("./errorHandler");
const jwt = require("jsonwebtoken");

const authentication = catchAsync(async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new ErrorHandler("Authentication failed", 400));
  }

  const token = authorization.split(" ")[1];

  const payload = jwt.verify(token, process.env.SECRET_KEY);

  req.user = {
    userId: payload.userId,
    username: payload.username,
    name: payload.name,
    image: payload.image,
  };

  next();
});

module.exports = authentication;
