const app = require("./app");
const { initializeDatabase } = require("./config/db");

const PORT = process.env.PORT || 4000;

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database initialization failed:", error);
    process.exit(1);
  });

