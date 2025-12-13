const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend working!" });
});

app.listen(PORT, () => {
  console.log(`server works on port ${PORT}`);
  console.log(`Open http://localhost:${PORT}`);
});
