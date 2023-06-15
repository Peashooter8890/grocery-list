const GroceryCollection = require("../models/GroceryCollection");

exports.getAllGroceryLists = async (req, res) => {
    try {
        let groceryCollection = await GroceryCollection.findOne({ userId: req.user.id });
        if (!groceryCollection) {
            // if groceryCollection does not exist for user, create a new one.
            groceryCollection = new GroceryCollection({ userId: req.user.id, groceryLists: [] });
            await groceryCollection.save();
        }
        res.status(200).json(groceryCollection.groceryLists);
    } catch (error) {
        error.message = "Something went wrong with fetching grocery lists.";
        next(error);
    }
}

exports.addGroceryList = async (req, res) => {
    try {
        let groceryCollection = await GroceryCollection.findOne({ userId: req.user.id });
        if (!groceryCollection) {
            // if groceryCollection does not exist for user, create a new one.
            groceryCollection = new GroceryCollection({ userId: req.user.id });
        }
        groceryCollection.groceryLists.push({ items: [] }); 
        await groceryCollection.save();
        res.status(200).json({message: "Grocery list added succesfully." });
    } catch (error) {
        error.message = "Something went wrong with adding the grocery list.";
        next(error);
    }
}

exports.deleteGroceryList = async (req, res) => {
    try {
        let groceryCollection = await GroceryCollection.findOne({ userId: req.user.id });
        if (!groceryCollection) {
            // if groceryCollection does not exist for user, create a new one.
            groceryCollection = new GroceryCollection({ userId: req.user.id });
        }
        const listId = req.params.id; // get the grocery list id from request parameters
        groceryCollection.groceryLists.id(listId).remove();
        await groceryCollection.save();
        res.status(200).json({message: "Grocery list removed succesfully." });
    } catch (error) {
        error.message = "Something went wrong with deleting the grocery list.";
        next(error);
    }
}

exports.getGroceryListItems = async (req, res) => {
    try {
        const listId = req.params.id;
        let groceryCollection = await GroceryCollection.findOne({ userId: req.user.id });
        if (!groceryCollection) {
            // if groceryCollection does not exist for user, create a new one.
            groceryCollection = new GroceryCollection({ userId: req.user.id });
        }
        const list = groceryCollection.groceryLists.id(listId);
        if (!list) {
            const error = Object.assign(new Error("No grocery list of the provided ID was found."), { statusCode: 400 });
            next(error);
        }
        res.status(200).json(list.items);
    } catch (error) {
        error.message = "Something went wrong with fetching grocery list items.";
        next(error);
    }
}

exports.setGroceryList = async (req, res) => {
    try {
        const listId = req.params.id;
        const items = req.body;
        let groceryCollection = await GroceryCollection.findOne({ userId: req.user.id });
        if (!groceryCollection) {
            return res.status(400).json({ error: "No grocery lists found" });
        }
        const list = groceryCollection.groceryLists.id(listId);
        if (!list) {
            const error = Object.assign(new Error("No grocery list of the provided ID was found."), { statusCode: 400 });
            next(error);
        }
        list.items = items;
        await groceryCollection.save();
        res.status(200).json(list);
    } catch (error) {
        error.message = "Something went wrong with updating the grocery list";
        next(error);
    }
}
