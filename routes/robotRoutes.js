const express = require("express");
const { getRandomResponse } = require("../controller/robotController");

const router = express.Router();
router.post("/robot-response", getRandomResponse);

module.exports = router;
