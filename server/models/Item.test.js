const { describe, it, expect, beforeAll, afterAll } = require("@jest/globals");
const {Item} = require(".");
const sequelize = require("../db");

// define in global scope
let item;

// clear db and create new card before tests
beforeAll(async () => {
  await sequelize.sync({ force: true });
  item = await Item.create({ name: "Weeble", price: 5.99, description: "Weebles wobble but they don't fall down!", category: "toys", image: 'https://pbs.twimg.com/media/Co37CebVYAAuEvo.jpg:large' });
});

// clear db after tests
afterAll(async () => await sequelize.close());

describe("Item", () => {
  it("has an id", async () => {
    expect(item).toHaveProperty("id");
  });

  it("has the correct name", async () => {
    expect(item).toHaveProperty("name");
    expect(item.name).toBe('Weeble');
  });

  it('has the correct price', async () => {
    expect(item).toHaveProperty('price');
    expect(item.price).toBe(5.99);
  });

  it('has the correct description', async () => {
    expect(item).toHaveProperty('description');
    expect(item.description).toBe("Weebles wobble but they don't fall down!");
  });

  it('has the correct category', async () => {
    expect(item).toHaveProperty('category');
    expect(item.category).toBe('toys');
  });

  it('has the correct image', async () => {
    expect(item).toHaveProperty('image');
    expect(item.image).toBe('https://pbs.twimg.com/media/Co37CebVYAAuEvo.jpg:large');
  });

});