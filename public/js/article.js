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

    const userVotes = JSON.parse(localStorage.getItem("votes") || "{}");
    const voteKey = `article_${article.id}`;

    const currentVote = userVotes[voteKey];

    articleContainer.innerHTML = `
    <article class="article-card">
        <h2>${article.title}</h2>
        <div class="meta">By ${article.author} | ${date}</div>
        <div class="content" style="white-space: pre-wrap;">${
          article.content
        }</div>
        
        <div class="vote-container">
             <button 
                class="${currentVote === "like" ? "voted" : ""}" 
                onclick="vote('article', ${article.id}, 'like', this)">
                👍 <span id="article-likes-${article.id}">${
      article.likes || 0
    }</span>
            </button>
            <button 
                class="${currentVote === "dislike" ? "voted" : ""}" 
                onclick="vote('article', ${article.id}, 'dislike', this)">
                👎 <span id="article-dislikes-${article.id}">${
      article.dislikes || 0
    }</span>
            </button>
        </div>
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

  const userVotes = JSON.parse(localStorage.getItem("votes") || "{}");
  const voteKey = `comment_${comment.id}`;

  const currentVote = userVotes[voteKey];

  const cssClass = isReply ? "comment reply" : "comment";

  const div = document.createElement("div");
  div.className = cssClass;

  div.innerHTML = `
        <div class="comment-header">
            <span>${comment.author}</span>
            <span>${date}</span>
        </div>
        <div class="comment-body">${comment.content}</div>
        
        <div class="vote-container" style="margin-top: 5px; font-size: 0.9em;">
             <button 
                class="${currentVote === "like" ? "voted" : ""}"
                onclick="vote('comment', ${comment.id}, 'like', this)">
                👍 <span id="comment-likes-${comment.id}">${
    comment.likes || 0
  }</span>
            </button>
            
            <button 
                class="${currentVote === "dislike" ? "voted" : ""}"
                onclick="vote('comment', ${comment.id}, 'dislike', this)">
                👎 <span id="comment-dislikes-${comment.id}">${
    comment.dislikes || 0
  }</span>
            </button>
            
            ${
              !isReply
                ? `<button class="reply-btn" style="margin-left: 10px;" onclick="toggleReplyForm(${comment.id})">Reply</button>`
                : ""
            }
        </div>

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

if (articleId) {
  loadArticle();
  loadComments();
}
