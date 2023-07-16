const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const validateWOwner = require("../middlewares/validateOwner");
const multer = require("multer");

const {
  createPost,
  createComment,
  getPost,
  getSinglePost,
  updatePost,
  deletePost,
  likePost,
} = require("../controllers/post");

// multer for user image uploads
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

//routes
router.post(
  "/create",
  authentication,
  uploadOptions.array("images", 5),
  createPost
);

router.get("/", getPost);

router.get("/:id", getSinglePost);

router.patch("/createcomment/:id", authentication, createComment);

router.patch("/like/:id", authentication, likePost);

router.patch("/update/:id", authentication, validateWOwner, updatePost);

router.delete("/delete/:id", authentication, validateWOwner, deletePost);

module.exports = router;
