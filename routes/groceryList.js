const router = require('express').Router();
const groceryListController = require('../controllers/groceryListController');

router.get("/getAllGroceryLists", groceryListController.getAllGroceryLists);
router.post("/addGroceryList", groceryListController.addGroceryList);
router.delete("/deleteGroceryList/:id", groceryListController.deleteGroceryList);
router.get("/getGroceryListItems/:id", groceryListController.getGroceryListItems);
router.put("/setGroceryList/:id", groceryListController.setGroceryList);

module.exports = router;