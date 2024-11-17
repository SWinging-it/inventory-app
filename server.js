const app = require("./server/app");
const sequelize = require("./server/db");

const PORT = process.env.PORT || 3000;

async function init() {
  try {
    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`Server listening at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

init();
