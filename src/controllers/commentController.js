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

// 3. Vote for a comment
exports.voteComment = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;

  const allowedTypes = ["like", "dislike", "remove-like", "remove-dislike"];
  if (!allowedTypes.includes(type)) {
    return res.status(400).json({ error: "Invalid vote type" });
  }

  try {
    let queryPart = "";

    if (type === "like") queryPart = "likes = likes + 1";
    if (type === "dislike") queryPart = "dislikes = dislikes + 1";
    if (type === "remove-like") queryPart = "likes = GREATEST(likes - 1, 0)";
    if (type === "remove-dislike")
      queryPart = "dislikes = GREATEST(dislikes - 1, 0)";

    const result = await db.query(
      `UPDATE comments SET ${queryPart} WHERE id = $1 RETURNING likes, dislikes`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while voting" });
  }
};
