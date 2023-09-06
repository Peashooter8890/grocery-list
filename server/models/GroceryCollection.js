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
    name: {
        type: String,
        default: ''
    },
    items: [GroceryItemSchema],
    permission: {
        type: String,
        enum: ['owner', 'editor', 'viewer'],
        required: true
    },
    sharedWith: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        permission: {
            type: String,
            enum: ['editor', 'viewer'],
            required: true
        }
    }],
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

const GroceryCollection = mongoose.model("GroceryCollection", GroceryCollectionSchema, 'groceryCollections');

module.exports = GroceryCollection;