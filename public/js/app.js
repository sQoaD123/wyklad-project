const articlesList = document.getElementById("articles-list");

async function fetchArticles() {
  try {
    const response = await fetch("/api/articles");
    const articles = await response.json();

    articlesList.innerHTML = "";

    if (articles.length === 0) {
      articlesList.innerHTML = "<p>No articles yet. Become first one!</p>";
      return;
    }

    articles.forEach((article) => {
      const date = new Date(article.created_at).toLocaleDateString("pl-PL");

      const userVotes = JSON.parse(localStorage.getItem("votes") || "{}");
      const isLiked = userVotes[`article_${article.id}`] === "like";
      const isDisliked = userVotes[`article_${article.id}`] === "dislike";

      const articleHTML = `
                <article class="article-card">
                    <h2>${article.title}</h2>
                    <div class="meta">Author: <strong>${
                      article.author
                    }</strong> | Date: ${date}</div>
                    <div class="content">
                        ${article.content.substring(0, 150)}... 
                    </div>
                    
                    <div class="vote-container">
    <button 
        class="${isLiked ? "voted" : ""}" 
        onclick="vote('article', ${article.id}, 'like', this)">
        👍 <span id="article-likes-${article.id}">${article.likes || 0}</span>
    </button>
    
    <button 
        class="${isDisliked ? "voted" : ""}" 
        onclick="vote('article', ${article.id}, 'dislike', this)">
        👎 <span id="article-dislikes-${article.id}">${
        article.dislikes || 0
      }</span>
    </button>
    
    <a href="article.html?id=${
      article.id
    }" class="read-more" style="margin-left: auto;">Read & Comment →</a>
</div>
                </article>
            `;
      articlesList.innerHTML += articleHTML;
    });
  } catch (error) {
    console.error("Error:", error);
    articlesList.innerHTML =
      '<p style="color:red">Error during loading articles.</p>';
  }
}

fetchArticles();

async function vote(entityType, id, type, btnElement) {
  const storageKey = "votes";
  const userVotes = JSON.parse(localStorage.getItem(storageKey) || "{}");
  const voteKey = `${entityType}_${id}`;

  const currentVote = userVotes[voteKey];

  let actionType = type;

  if (currentVote === type) {
    actionType = `remove-${type}`;
  } else if (currentVote && currentVote !== type) {
    alert("Please uncheck your current vote before changing it.");
    return;
  }

  const endpoint = `/api/${entityType}s/${id}/vote`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: actionType }),
    });

    if (response.ok) {
      const data = await response.json();

      document.getElementById(`${entityType}-likes-${id}`).textContent =
        data.likes;
      document.getElementById(`${entityType}-dislikes-${id}`).textContent =
        data.dislikes;

      if (actionType.startsWith("remove-")) {
        delete userVotes[voteKey];
        btnElement.classList.remove("voted");
      } else {
        userVotes[voteKey] = type;
        btnElement.classList.add("voted");
      }

      localStorage.setItem(storageKey, JSON.stringify(userVotes));
    } else {
      alert("Error voting");
    }
  } catch (error) {
    console.error(error);
  }
}
