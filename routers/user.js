const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");

const { getUsers } = require("../controllers/user");

//routes
router.get("/", authentication, getUsers);

module.exports = router;
