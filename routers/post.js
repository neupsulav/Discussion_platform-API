const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");

const { createPost, createComment, getPost } = require("../controllers/post");

//routes
router.post("/create", authentication, createPost);

router.get("/", getPost);

router.post("/createComment/:id", authentication, createComment);

module.exports = router;
