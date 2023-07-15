const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");

const { profileData } = require("../controllers/profile");

//routes
router.get("/", authentication, profileData);

module.exports = router;
