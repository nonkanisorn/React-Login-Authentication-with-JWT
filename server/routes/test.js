const express = require("express");
const router = express.Router();
const { test } = require("../controllers/test.js");

router.get("/test", test);

module.exports = router;
