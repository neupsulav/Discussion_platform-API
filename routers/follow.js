const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");

const { followUser, followinglist } = require("../controllers/follow");

//routes
router.patch("/follow/:id", authentication, followUser);

router.patch("/follow/:id", authentication, followUser);

module.exports = router;
