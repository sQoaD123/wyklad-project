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

      const articleHTML = `
                <article class="article-card">
                    <h2>${article.title}</h2>
                    <div class="meta">Author: <strong>${
                      article.author
                    }</strong> | Date: ${date}</div>
                    <div class="content">
                        ${article.content.substring(0, 150)}... 
                    </div>
                    <a href="article.html?id=${
                      article.id
                    }" class="read-more">Read and comment →</a>
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
