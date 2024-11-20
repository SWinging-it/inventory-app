const express = require("express");
const {check, validationResult} = require('express-validator');
const { Item } = require("../models");

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({extended: true}));

// Get all items and return OK status. If any errors occur or no items exist, throw the error.
router.get('/', async (req, res, next) => {
    try {
        const items = await Item.findAll();
        if (items.length === 0) { // If no items are found, send back an error. Use .length as findAll returns an array.
            res.status(404).json({error: "No items found"});
            return;
        }
        res.status(200).json(items); // Send back all items
    } catch (error){
        res.status(500); // Catch any other errors
        next(error);
    }
});

// Get the specified item from parameters and return OK status. If any errors occur or item doesn't exist, throw the error.
router.get('/:id', async (req, res, next) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item) { // If specific item isn't found, send back an error
            res.status(404).json({error: "Item not found"});
            return;
        }
        res.status(200).json(item); // Send back the specific item
    } catch (error){
        res.status(500); // Catch any other errors
        next(error);
    }
});

// Create a new Item from Item model
router.post('/', [ // These checks ensure form data follows set rules, and will throw relevant errors if it breaks any.
    check('name').trim().notEmpty().withMessage('name cannot be empty').isString().withMessage('name must be a string'),
    check('price').trim().notEmpty().withMessage('price cannot be empty').isNumeric().withMessage('price must be a number'),
    check('description').trim().notEmpty().withMessage('description cannot be empty').isString().withMessage('description must be a string'),
    check('category').trim().notEmpty().withMessage('category cannot be empty').isString().withMessage('category must be a string')], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Sends the relevant error
    }
    try {
        const item = await Item.create(req.body); // Create new Item with the form's data and send Created Successfully status
        res.status(201).json(item);
    } catch (error){
        if (error.name === "SequelizeUniqueConstraintError"){ // Throw error if name field isn't unique
            return res.status(400).json({"errors": [
                {
                    "type": "field",
                    "value": req.body.name,
                    "msg": "name must be unique",
                    "path": "name",
                    "location": "body"
                }
            ]});
        }
        if (error.message === "Validation error: Validation isUrl on image failed"){ // Throw error if image field isn't null and isn't a URL
            return res.status(400).json({"errors": [
                {
                    "type": "field",
                    "value": req.body.image,
                    "msg": "image must be a URL",
                    "path": "image",
                    "location": "body"
                }
            ]});
        }
        res.status(500); // Catch any other errors
        next(error);
    }
});

// Update an Item with a form's data
router.put('/:id', [ // These checks ensure form data follows set rules, and will throw relevant errors if it breaks any.
    check('name').trim().notEmpty().withMessage('name cannot be empty').isString().withMessage('name must be a string'),
    check('price').trim().notEmpty().withMessage('price cannot be empty').isNumeric().withMessage('price must be a number'),
    check('description').trim().notEmpty().withMessage('description cannot be empty').isString().withMessage('description must be a string'),
    check('category').trim().notEmpty().withMessage('category cannot be empty').isString().withMessage('category must be a string')], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Sends the relevant error
    }
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item){ // If specific item isn't found, send back an error
            res.status(404).json({error: "Item not found"});
            return;
        }
        const updatedItem = await item.update(req.body); // Update target Item with the form's data and send OK status
        res.status(200).json(updatedItem);
    } catch (error){
        if (error.name === "SequelizeUniqueConstraintError"){ // Throw error if name field isn't unique
            return res.status(400).json({"errors": [
                {
                    "type": "field",
                    "value": req.body.name,
                    "msg": "name must be unique",
                    "path": "name",
                    "location": "body"
                }
            ]});
        }
        if (error.message === "Validation error: Validation isUrl on image failed"){ // Throw error if image field isn't null and isn't a URL
            return res.status(400).json({"errors": [
                {
                    "type": "field",
                    "value": req.body.image,
                    "msg": "image must be a URL",
                    "path": "image",
                    "location": "body"
                }
            ]});
        }
        res.status(500); // Catch any other errors
        next(error);
    }
});

// Delete a specific Item
router.delete('/:id', async (req, res, next) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item) { // If specific item isn't found, send back an error
            return res.status(404).json({error: "Item not found"});
        }
        const deletedItem = await item.destroy(); // Delete the specific item and send back an OK status
        res.status(200).json(deletedItem);
    } catch (error){
        res.status(500); // Catch any ther errors
        next(error);
    }
});

module.exports = router;
