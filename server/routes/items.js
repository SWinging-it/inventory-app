const express = require("express");
const { Item } = require("../models");

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({extended: true}));

// Define your routes here
router.get('/', async (req, res) => {
    try {
        const items = await Item.findAll();
        res.status(200).json(items);
    } catch (error){
        next(error);
    }
});

router.get('/:id', async (req, res) => {
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

module.exports = router;
