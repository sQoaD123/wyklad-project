const db = require("./db");

const addColumns = async () => {
  try {
    await db.query(`
      ALTER TABLE articles 
      ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS dislikes INTEGER DEFAULT 0;
    `);
    console.log("Updated articles table.");

    await db.query(`
      ALTER TABLE comments 
      ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS dislikes INTEGER DEFAULT 0;
    `);
    console.log("Updated comments table.");

    process.exit(0);
  } catch (err) {
    console.error("Error updating database:", err);
    process.exit(1);
  }
};

addColumns();
