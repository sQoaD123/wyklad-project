const form = document.getElementById("create-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const content = document.getElementById("content").value;

  const newArticle = { title, author, content };

  try {
    const response = await fetch("/api/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newArticle),
    });

    if (response.ok) {
      window.location.href = "index.html";
    } else {
      alert("Error during article creation");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Connection error");
  }
});
