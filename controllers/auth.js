const User = require("../models/user");
const catchAsync = require("../middlewares/catchAsync");
const ErrorHandler = require("../middlewares/errorHandler");
const nodemailer = require("nodemailer");

//function for mail
const sendVerificationMail = catchAsync(async (name, email, userid) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: "neupsulav@gmail.com",
    to: email,
    subject: "For verification",
    html: `<p>Hi ${name}</p>, please click <a href=''http://localhost:3000/verify?id=${userid}>here</a> to verify your account`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email has been sent:", info.response);
    }
  });
});

const emailVerification = catchAsync(async (req, res, next) => {
  const updateInfo = await User.findByIdAndUpdate(
    { _id: req.query.id },
    { $set: { isVerified: true } }
  );
  res.status(200).json({ msg: "Email verified" });
});

//register new user
const register = catchAsync(async (req, res, next) => {
  const { name, email, username, password } = req.body;

  if (!name || !email || !username || !password) {
    return next(new ErrorHandler("Please fill all the fields properly", 400));
  }

  //for multer image upload
  const file = req.file;
  if (!file) return next(new ErrorHandler("Image file not received", 400));

  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  const newUser = await User.create({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    image: `${basePath}${fileName}`, // "http://localhost:3000/public/upload/image-2323232"
  });
  newUser.save();

  if (!newUser) {
    return next(new ErrorHandler("User couldn't be registered", 500));
  }

  //verification mail
  sendVerificationMail(req.body.name, req.body.email, newUser._id);

  res.status(201).json({ success: true, msg: "New user created successfully" });
});

//login user
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErrorHandler("Please provide all the user credentials", 400)
    );
  }

  const checkUser = await User.findOne({ email: email });

  if (!checkUser) {
    return next(new ErrorHandler("Invalid user credentials", 400));
  }

  const isPasswordCorrect = await checkUser.comparePassword(password);

  //compare password
  if (!isPasswordCorrect) {
    return next(new ErrorHandler("Invalid user credentials", 400));
  }

  //generate token
  const token = await checkUser.getJwt();

  res.status(200).json({ msg: "User logged in successfully", token: token });
});

module.exports = {
  register,
  login,
  emailVerification,
};
