const express = require("express");
const cors = require("cors");
require("dotenv").config();

process.on("uncaughtException", (err) => {
  console.error("UNCUGHT ERROR:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED PROMISE:", err);
});

console.log("🔥 Server starting...");

console.log("🔥 Server file started"); // to verify file is running

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend files from /public folder
app.use(express.static("public"));

// Import database pool
const pool = require("./src/db");

// Import routes
const linkRoutes = require("./src/routes/links");
const { getLink } = require("./src/controllers/linksController");




// Health check
app.get("/healthz", (req, res) => {
  res.status(200).json({
    ok: true,
    version: "1.0",
    uptime: process.uptime()
  });
});


app.use("/api/links", linkRoutes);

app.get("/", (req, res) => {
  res.send("URL Shortener Backend Running ✔️");
});

// Redirect short code at root
app.get("/:code", getLink);





// Verify DB connection
pool.query("SELECT NOW()", (err, result) => {
    if (err) console.log("❌ DB Error:", err);
    else console.log("✅ DB Connected:", result.rows);
});

app.get("/code/:code", (req, res) => {
  res.sendFile(__dirname + "/public/stats.html");
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT,'0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
