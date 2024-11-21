const sequelize = require("./db");
const { Item } = require("./models");
const items = require("./items.json");

async function seed() {
  await sequelize.sync({ force: true });
  await Item.bulkCreate(items);
  console.log("Database populated");
}

if (typeof require !== 'undefined' && require.main === module) {
  seed();
}

module.exports = seed;