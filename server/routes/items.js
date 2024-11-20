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
        if (items.length === 0) {
            res.status(404).json({error: "No items found"});
            return;
        }
        res.status(200).json(items);
    } catch (error){
        res.status(500);
        next(error);
    }
});

// Get the specified item from parameters and return OK status. If any errors occur or item doesn't exist, throw the error.
router.get('/:id', async (req, res, next) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item) {
            res.status(404).json({error: "Item not found"});
            return;
        }
        res.status(200).json(item);
    } catch (error){
        res.status(500);
        next(error);
    }
});

// Create a new Item from Item model and return Successful Creation status + created item. If any errors occur, throw the error.
router.post('/', [
    check('name').trim().notEmpty().withMessage('name cannot be empty').isString().withMessage('name must be a string'),
    check('price').trim().notEmpty().withMessage('price cannot be empty').isNumeric().withMessage('price must be a number'),
    check('description').trim().notEmpty().withMessage('description cannot be empty').isString().withMessage('description must be a string'),
    check('category').trim().notEmpty().withMessage('category cannot be empty').isString().withMessage('category must be a string')], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const item = await Item.create(req.body);
        res.status(201).json(item);
    } catch (error){
        if (error.name === "SequelizeUniqueConstraintError"){
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
        res.status(500);
        next(error);
    }
});


// POST route to create a new item
// router.post('/items', async (req, res) => {
//     const { name, price, description, category, imageUrl } = req.body;

//     res.status(201).json({ success: true });
  
//     try {
//       const newItem = await Item.create({ 
//         name, 
//         price, 
//         description, 
//         category, 
//         imageUrl 
//       });
//       res.status(201).json(newItem); // Successfully created item
//     } catch (error) {
//       console.error('Error adding item:', error);
//       res.status(500).json({ error: "Failed to add item." });
//     }
//   });
// module.exports = router;
