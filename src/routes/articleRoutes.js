const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articleController");

// GET /api/articles - Get list of articles
router.get("/", articleController.getAllArticles);

// POST /api/articles - Create a new article
router.post("/", articleController.createArticle);

// GET /api/articles/:id - Get specific article (e.g. /api/articles/5)
router.get("/:id", articleController.getArticleById);

module.exports = router;
