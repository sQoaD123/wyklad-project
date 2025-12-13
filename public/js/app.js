fetch("/api/test")
  .then((response) => response.json())
  .then((data) => {
    document.getElementById("status").textContent = data.message;
  })
  .catch((error) => {
    console.error("error:", error);
    document.getElementById("status").textContent =
      "error with server connection";
  });
