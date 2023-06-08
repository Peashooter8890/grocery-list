const GroceryList = require("../models/GroceryList");

exports.getGroceryList = async (req, res) => {
    try {
        let groceryList = await GroceryList.findOne();
        if (!groceryList) {
            // if grocery list does not exist, make one.
            groceryList = new GroceryList({ groceryItems: [] });
            await groceryList.save();
        }
        // only return the items, not the schema id
        res.status(200).json(groceryList.groceryItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.setGroceryList = async (req, res) => {
    try {
        const groceryItems = req.body;
        let groceryList = await GroceryList.findOne();

        if (!groceryList) {
            // if grocery list does not exist, make one.
            groceryList = new GroceryList();
        }

        groceryList.groceryItems = groceryItems;
        await groceryList.save();
        res.status(200).json(groceryList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}