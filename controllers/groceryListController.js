const GroceryCollection = require("../models/GroceryCollection");

exports.getAllGroceryLists = async (req, res, next) => {
    try {
        let groceryCollection = await GroceryCollection.findOne({ userId: req.user.id });
        if (!groceryCollection) {
            throw new Error("No grocery collection was found for the user.");
        }
        res.status(200).json(groceryCollection.groceryLists);
    } catch (error) {
        if (!error.message) {
            error.message = "Something went wrong with fetching grocery lists.";
        }
        next(error);
    }
}

exports.addGroceryList = async (req, res, next) => {
    try {
        let groceryCollection = await GroceryCollection.findOne({ userId: req.user.id });
        if (!groceryCollection) {
            // if groceryCollection does not exist for user, create a new one.
            groceryCollection = new GroceryCollection({ userId: req.user.id });
        }
        const newGroceryList = { name: req.body.name, items: [] };
        groceryCollection.groceryLists.push(newGroceryList);
        await groceryCollection.save();

        const addedGroceryList = groceryCollection.groceryLists[groceryCollection.groceryLists.length - 1];

        res.status(200).json({ message: "Grocery list added successfully.", newGroceryList: addedGroceryList });
    } catch (error) {
        if (!error.message) {
            error.message = "Something went wrong with adding grocery list.";
        }
        next(error);
    }
};

exports.renameGroceryList = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const { name } = req.body; 

        let groceryCollection = await GroceryCollection.findOne({ userId: req.user.id });
        if (!groceryCollection) {
            throw new Error("No grocery collection found for this user."); 
        }
        const groceryList = groceryCollection.groceryLists.find(list => list.id === id);
        if (!groceryList) {
            throw new Error("No grocery list found with this id."); 
        }
        groceryList.name = name;
        await groceryCollection.save();

        res.status(200).json({ message: "Grocery list renamed successfully.", newGroceryList: groceryList });
    } catch (error) {
        if (!error.message) {
            error.message = "Something went wrong with renaming the grocery list.";
        }
        next(error);
    }
};

exports.deleteGroceryList = async (req, res, next) => {
    try {
        let groceryCollection = await GroceryCollection.findOne({ userId: req.user.id });
        if (!groceryCollection) {
            throw new Error('something is very wrong. User can\'t delete a list in a nonexistent collection.');
        }
        const listId = req.params.id;

        const index = groceryCollection.groceryLists.findIndex(list => list.id === listId);
        if (index === -1) {
            throw new Error('No grocery list found with the specified ID.');
        }

        groceryCollection.groceryLists.splice(index, 1);
        await groceryCollection.save();
        res.status(200).json({message: "Grocery list removed succesfully." });
    } catch (error) {
        if (!error.message) {
            error.message = "Something went wrong with deleting grocery list.";
        }
        next(error);
    }
}

exports.getGroceryListItems = async (req, res, next) => {
    try {
        const listId = req.params.id;
        let groceryCollection = await GroceryCollection.findOne({ userId: req.user.id });
        if (!groceryCollection) {
            // if groceryCollection does not exist for user, create a new one.
            groceryCollection = new GroceryCollection({ userId: req.user.id });
        }
        const list = groceryCollection.groceryLists.id(listId);
        if (!list) {
            throw new Error("No grocery list of the provided ID was found.");
        }
        res.status(200).json(list.items);
    } catch (error) {
        if (!error.message) {
            error.message = "Something went wrong with fetching grocery list items.";
        }
        next(error);
    }
}

exports.setGroceryList = async (req, res, next) => {
    try {
        const listId = req.params.id;
        const items = req.body;
        let groceryCollection = await GroceryCollection.findOne({ userId: req.user.id });
        if (!groceryCollection) {
            groceryCollection = new GroceryCollection({ userId: req.user.id });
        }
        const list = groceryCollection.groceryLists.id(listId);
        if (!list) {
            throw new Error("No grocery list of the provided ID was found.");
        }
        list.items = items;
        await groceryCollection.save();
        res.status(200).json(list);
    } catch (error) {
        if (!error.message) {
            error.message = "Something went wrong with updating grocery list.";
        }
        next(error);
    }
}
