const express = require("express");
const cors = require("cors");
require("dotenv").config();

const articleRoutes = require("./routes/articleRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/articles", articleRoutes);

app.listen(PORT, () => {
  console.log(`server works on port ${PORT}`);
  console.log(`Open http://localhost:${PORT}`);
});
