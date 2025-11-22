const { customAlphabet } = require("nanoid");
const pool = require("../db");

// nanoid generator
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz1234567890", 6);

// Create short URL
exports.createLink = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    const code = nanoid();
    const result = await pool.query(
      "INSERT INTO links (code, original_url) VALUES ($1, $2) RETURNING *",
      [code, url]
    );

    res.json({
      shortUrl: `${process.env.BASE_URL}/${code}`,
      data: result.rows[0]
    });

  } catch (error) {
    console.error("CreateLink Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Redirect using short code with click tracking
exports.getLink = async (req, res) => {
  try {
    const { code } = req.params;

    // Find the link
    const result = await pool.query(
      "SELECT * FROM links WHERE code = $1",
      [code]
    );

    if (result.rowCount === 0)
      return res.status(404).send("Link not found");

    // Increment clicks and update last_clicked
    await pool.query(
      "UPDATE links SET clicks = clicks + 1, last_clicked = NOW() WHERE code = $1",
      [code]
    );

    // Redirect to original URL
    res.redirect(result.rows[0].original_url);

  } catch (error) {
    console.error("GetLink Error:", error);
    res.status(500).send("Server error");
  }
};
// List all links
exports.listLinks = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM links ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("ListLinks Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a link
exports.deleteLink = async (req, res) => {
  try {
    const { code } = req.params;
    const result = await pool.query(
      "DELETE FROM links WHERE code = $1 RETURNING *",
      [code]
    );

    if (result.rowCount === 0) return res.status(404).json({ error: "Link not found" });

    res.json({ message: "Link deleted", data: result.rows[0] });
  } catch (error) {
    console.error("DeleteLink Error:", error);
    res.status(500).json({ error: error.message });
  }
};
// Get stats for a single code
exports.getLinkStats = async (req, res) => {
  try {
    const { code } = req.params;
    const result = await pool.query("SELECT * FROM links WHERE code = $1", [code]);

    if (result.rowCount === 0) return res.status(404).json({ error: "Link not found" });

    res.json({
      shortUrl: `${process.env.BASE_URL}/${code}`,
      data: result.rows[0]
    });
  } catch (error) {
    console.error("GetLinkStats Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
// Fetch all links
exports.getAllLinks = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM links ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("GetAllLinks Error:", error);
    res.status(500).json({ error: error.message });
  }
};
