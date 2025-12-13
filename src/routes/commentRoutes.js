const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

// GET /api/comments/:articleId
// Example: /api/comments/1 -> returns all comments for article 1
router.get("/:articleId", commentController.getCommentsByArticleId);

// POST /api/comments
// Body: { article_id: 1, parent_id: null, author: "Me", content: "Hi" }
router.post("/", commentController.addComment);

module.exports = router;
