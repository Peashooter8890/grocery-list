const mongoose = require("mongoose");

const GroceryItemSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
});

const GroceryListSchema = new mongoose.Schema({
    items: [GroceryItemSchema],
    creationDate: {
        type: Date,
        default: Date.now
    },
});

const GroceryCollectionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    groceryLists: [GroceryListSchema],
});

const GroceryCollection = mongoose.model("GroceryCollection", GroceryCollectionSchema);

module.exports = GroceryCollection;