const express = require("express");
const router = express.Router();
const { createLink, getLink, getAllLinks, getLinkStats,  deleteLink } = require("../controllers/linksController");

// Create short URL
router.post("/", createLink);

// Redirect using short code
router.get("/:code", getLink);

//fetch all links
router.get("/", getAllLinks);

// Get stats for a code
router.get("/stats/:code", getLinkStats);


// List all links
//router.get("/", listLinks);

// Delete a link
router.delete("/:code", deleteLink);

module.exports = router;
