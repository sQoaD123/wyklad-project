const db = require("../config/db");

// 1. Get all comments for a specific article
exports.getCommentsByArticleId = async (req, res) => {
  const { articleId } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC",
      [articleId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while fetching comments" });
  }
};

// 2. Add a new comment (or reply)
exports.addComment = async (req, res) => {
  const { article_id, parent_id, author, content } = req.body;

  if (!article_id || !author || !content) {
    return res
      .status(400)
      .json({ error: "Article ID, author, and content are required" });
  }

  try {
    const result = await db.query(
      "INSERT INTO comments (article_id, parent_id, author, content) VALUES ($1, $2, $3, $4) RETURNING *",
      [article_id, parent_id || null, author, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while adding comment" });
  }
};
