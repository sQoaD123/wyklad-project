const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get("id");

const articleContainer = document.getElementById("article-container");
const commentsList = document.getElementById("comments-list");
const mainCommentForm = document.getElementById("main-comment-form");

async function loadArticle() {
  try {
    const res = await fetch(`/api/articles/${articleId}`);
    if (!res.ok) throw new Error("Article not found");
    const article = await res.json();

    const date = new Date(article.created_at).toLocaleDateString("pl-PL");

    articleContainer.innerHTML = `
            <article class="article-card">
                <h2>${article.title}</h2>
                <div class="meta">By ${article.author} | ${date}</div>
                <div class="content" style="white-space: pre-wrap;">${article.content}</div>
            </article>
        `;
  } catch (err) {
    articleContainer.innerHTML = "<h2>Article not found</h2>";
  }
}

async function loadComments() {
  try {
    const res = await fetch(`/api/comments/${articleId}`);
    const comments = await res.json();

    commentsList.innerHTML = "";

    const rootComments = comments.filter((c) => c.parent_id === null);

    rootComments.forEach((root) => {
      renderCommentHTML(root, false);

      const replies = comments.filter((c) => c.parent_id === root.id);
      replies.forEach((reply) => {
        renderCommentHTML(reply, true);
      });
    });
  } catch (err) {
    console.error(err);
  }
}

function renderCommentHTML(comment, isReply) {
  const date = new Date(comment.created_at).toLocaleDateString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const cssClass = isReply ? "comment reply" : "comment";

  const div = document.createElement("div");
  div.className = cssClass;
  div.innerHTML = `
        <div class="comment-header">
            <span>${comment.author}</span>
            <span>${date}</span>
        </div>
        <div class="comment-body">${comment.content}</div>
        ${
          !isReply
            ? `<button class="reply-btn" onclick="toggleReplyForm(${comment.id})">Reply</button>`
            : ""
        }
        
        <div id="reply-form-${comment.id}" class="reply-form-container">
            <input type="text" id="reply-author-${
              comment.id
            }" placeholder="Your Name" required>
            <textarea id="reply-content-${
              comment.id
            }" placeholder="Your reply..." required></textarea>
            <button onclick="submitReply(${comment.id})">Send Reply</button>
        </div>
    `;
  commentsList.appendChild(div);
}

mainCommentForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const author = document.getElementById("comment-author").value;
  const content = document.getElementById("comment-content").value;

  await postComment(author, content, null);

  mainCommentForm.reset();
  loadComments();
});

window.toggleReplyForm = (id) => {
  const form = document.getElementById(`reply-form-${id}`);
  form.classList.toggle("active");
};

window.submitReply = async (parentId) => {
  const author = document.getElementById(`reply-author-${parentId}`).value;
  const content = document.getElementById(`reply-content-${parentId}`).value;

  if (!author || !content) {
    alert("Please fill in all fields");
    return;
  }

  await postComment(author, content, parentId);
  loadComments();
};

async function postComment(author, content, parentId) {
  try {
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        article_id: articleId,
        parent_id: parentId,
        author,
        content,
      }),
    });
    if (!res.ok) alert("Error posting comment");
  } catch (err) {
    console.error(err);
  }
}

if (articleId) {
  loadArticle();
  loadComments();
}
