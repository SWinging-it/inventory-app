const express = require("express");
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
        next(error);
    }
});


// POST route to create a new item
router.post('/items', async (req, res) => {
    const { name, price, description, category, imageUrl } = req.body;

    res.status(201).json({ success: true });
  
    try {
      const newItem = await Item.create({ 
        name, 
        price, 
        description, 
        category, 
        imageUrl 
      });
      res.status(201).json(newItem); // Successfully created item
    } catch (error) {
      console.error('Error adding item:', error);
      res.status(500).json({ error: "Failed to add item." });
    }
  });
module.exports = router;
