const request = require('supertest');
const {describe, it, expect, beforeEach} = require('@jest/globals');
const app = require('../app');
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
});