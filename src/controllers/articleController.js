const db = require("../config/db");

// 1. Get all articles
exports.getAllArticles = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM articles ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while fetching articles" });
  }
};

// 2. Create a new article
exports.createArticle = async (req, res) => {
  const { title, content, author } = req.body;

  if (!title || !content || !author) {
    return res
      .status(400)
      .json({ error: "All fields (title, content, author) are required" });
  }

  try {
    const result = await db.query(
      "INSERT INTO articles (title, content, author) VALUES ($1, $2, $3) RETURNING *",
      [title, content, author]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while creating article" });
  }
};

// 3. Get single article by ID
exports.getArticleById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM articles WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while fetching article" });
  }
};
