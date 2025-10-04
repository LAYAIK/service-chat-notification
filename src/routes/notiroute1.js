const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

// POST subscribe
router.post("/subscribe", notificationController.subscribe);

// POST unsubscribe
router.post("/unsubscribe", notificationController.unsubscribe);

module.exports = router;
