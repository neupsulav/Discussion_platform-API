const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const validateWOwner = require("../middlewares/validateOwner");

const {
  createPost,
  createComment,
  getPost,
  getSinglePost,
  updatePost,
  deletePost,
} = require("../controllers/post");

//routes
router.post("/create", authentication, createPost);

router.get("/", getPost);

router.get("/:id", getSinglePost);

router.post("/createComment/:id", authentication, createComment);

router.patch("/update/:id", authentication, validateWOwner, updatePost);

router.delete("/delete/:id", authentication, validateWOwner, deletePost);

module.exports = router;
