const mongoose = require("mongoose");

const GroceryItemSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
    }
});

const GroceryListSchema = new mongoose.Schema({
    groceryItems: [GroceryItemSchema]
});

module.exports = mongoose.model("groceryList", GroceryListSchema, 'groceryList');