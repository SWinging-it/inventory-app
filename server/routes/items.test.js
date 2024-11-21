const request = require('supertest');
const {describe, it, expect, beforeEach} = require('@jest/globals');
const app = require('../app');
const sequelize = require('../db');
const {Item} = require('../models');
const seed = require('../seed');
let itemQuantity;

describe('Items', () => {
    beforeEach(async () => {
        await seed();
        const items = await Item.findAll();
        itemQuantity = items.length;
    });

    it('should return 200 on get', async () => {
        const response = await request(app).get('/api/items');
        expect(response.statusCode).toBe(200);
    });

    it('should return an array of items', async () => {
        const response = await request(app).get('/api/items');
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('price');
        expect(response.body[0]).toHaveProperty('description');
        expect(response.body[0]).toHaveProperty('category');
        expect(response.body[0]).toHaveProperty('image');
    });

    it('should return the correct number of items', async () => {
        const response = await request(app).get('/api/items');
        expect(response.body.length).toEqual(itemQuantity);
    });

    it('should return the correct items', async () => {
        const response = await request(app).get('/api/items');
        expect(response.body).toContainEqual(
            expect.objectContaining({
                id: 1,
                name: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
                price: 109.95,
                description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
                category: "men's clothing",
                image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
              })
        );
    });

    it('should return 404 error if no items to GET', async () => {
        await sequelize.truncate();
        const response = await request(app).get('/api/items');
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe("No items found");
    });

    it('should return the correct item', async () => {
        const response = await request(app).get('/api/items/1');
        expect(response.body).toEqual(
            expect.objectContaining({
                id: 1,
                name: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
                price: 109.95,
                description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
                category: "men's clothing",
                image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
              })
        );
    });

    it('should return 404 error if no item to GET', async () => {
        await sequelize.truncate();
        const response = await request(app).get('/api/items/1');
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe("Item not found");
    });

    it('should create a new item', async () => {
        const response = await request(app).post('/api/items').send({
            name: 'Weeble',
            price: 5.99,
            description: "Weebles wobble but they don't fall down!",
            category: 'toys',
            image: 'https://pbs.twimg.com/media/Co37CebVYAAuEvo.jpg:large'
        });
        expect(response.statusCode).toBe(201);
        const items = await Item.findAll();
        expect(items.length).toEqual(itemQuantity + 1);
        expect(items[20]).toEqual(
            expect.objectContaining({
                id: 21,
                name: 'Weeble',
                price: 5.99,
                description: "Weebles wobble but they don't fall down!",
                category: 'toys',
                image: 'https://pbs.twimg.com/media/Co37CebVYAAuEvo.jpg:large'
            })
        );
    });

    it('should return 400 and appropriate error(s) if form data is incorrect for POST', async () => {
        const response = await request(app).post('/api/items').send({
            name: "",
            price: "",
            description: "",
            category: "",
            image: ""
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.errors[0]).toEqual(
            expect.objectContaining({
                type: "field",
                value: "",
                msg: "name cannot be empty",
                path: "name",
                location: "body"
            })
        );
        expect(response.body.errors[1]).toEqual(
            expect.objectContaining({
                type: "field",
                value: "",
                msg: "price cannot be empty",
                path: "price",
                location: "body"
            })
        );
        expect(response.body.errors[2]).toEqual(
            expect.objectContaining({
                type: "field",
                value: "",
                msg: "price must be a number",
                path: "price",
                location: "body"
            })
        );
        expect(response.body.errors[3]).toEqual(
            expect.objectContaining({
                type: "field",
                value: "",
                msg: "description cannot be empty",
                path: "description",
                location: "body"
            })
        );
        expect(response.body.errors[4]).toEqual(
            expect.objectContaining({
                type: "field",
                value: "",
                msg: "category cannot be empty",
                path: "category",
                location: "body"
            })
        );
        const response2 = await request(app).post('/api/items').send({
            name: 51,
            price: "5.99",
            description: -0,
            category: 1e+30,
            image: "I'm not a Url"
        });
        expect(response2.body.errors[0]).toEqual(
            expect.objectContaining({
                type: "field",
                value: "I'm not a Url",
                msg: "image must be a URL",
                path: "image",
                location: "body"
            })
        );
        const response3 = await request(app).post('/api/items').send({
            name: "Mens Cotton Jacket",
            price: "5.99",
            description: -0,
            category: 1e+30,
        });
        expect(response3.body.errors[0]).toEqual(
            expect.objectContaining({
                type: "field",
                value: "Mens Cotton Jacket",
                msg: "name must be unique",
                path: "name",
                location: "body"
            })
        );
    });

    it('should update an item with new data', async () => {
        await request(app).put('/api/items/1').send({
            name: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
            price: 99.95,
            description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
            category: "men's clothing",
        });
        const items = await Item.findAll();
        expect(items[0]).toEqual(
            expect.objectContaining({
                id: 1,
                name: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
                price: 99.95,
                description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
                category: "men's clothing",
                image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
            })
        );
    });

    it('should return 404 error if no item to PUT', async () => {
        await sequelize.truncate();
        const response = await request(app).put('/api/items/1').send({
            name: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
            price: 99.95,
            description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
            category: "men's clothing",
            image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
        });
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe("Item not found");
    });

    it('should return 400 and appropriate error(s) if form data is incorrect', async () => {
        const response = await request(app).put('/api/items/1').send({
            name: "",
            price: "",
            description: "",
            category: "",
            image: ""
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.errors[0]).toEqual(
            expect.objectContaining({
                type: "field",
                value: "",
                msg: "name cannot be empty",
                path: "name",
                location: "body"
            })
        );
        expect(response.body.errors[1]).toEqual(
            expect.objectContaining({
                type: "field",
                value: "",
                msg: "price cannot be empty",
                path: "price",
                location: "body"
            })
        );
        expect(response.body.errors[2]).toEqual(
            expect.objectContaining({
                type: "field",
                value: "",
                msg: "price must be a number",
                path: "price",
                location: "body"
            })
        );
        expect(response.body.errors[3]).toEqual(
            expect.objectContaining({
                type: "field",
                value: "",
                msg: "description cannot be empty",
                path: "description",
                location: "body"
            })
        );
        expect(response.body.errors[4]).toEqual(
            expect.objectContaining({
                type: "field",
                value: "",
                msg: "category cannot be empty",
                path: "category",
                location: "body"
            })
        );
        const response2 = await request(app).put('/api/items/1').send({
            name: 51,
            price: "5.99",
            description: -0,
            category: 1e+30,
            image: "I'm not a Url"
        });
        expect(response2.body.errors[0]).toEqual(
            expect.objectContaining({
                type: "field",
                value: "I'm not a Url",
                msg: "image must be a URL",
                path: "image",
                location: "body"
            })
        );
        const response3 = await request(app).put('/api/items/1').send({
            name: "Mens Cotton Jacket",
            price: "5.99",
            description: -0,
            category: 1e+30,
        });
        expect(response3.body.errors[0]).toEqual(
            expect.objectContaining({
                type: "field",
                value: "Mens Cotton Jacket",
                msg: "name must be unique",
                path: "name",
                location: "body"
            })
        );
    });

    it('should delete a specific item', async () => {
        await request(app).delete('/api/items/1');
        const items = await Item.findAll();
        expect(items.length).toEqual(itemQuantity - 1);
        expect(items).toContainEqual(
            expect.not.objectContaining({
                id: 1,
                name: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
                price: 109.95,
                description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
                category: "men's clothing",
                image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
              })
        );
    });

    it('should return 404 error if no item to DELETE', async () => {
        await sequelize.truncate();
        const response = await request(app).delete('/api/items/1');
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe("Item not found");
    });
});