const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const groceryListController = require('../controllers/groceryListController');

router.get("/getAllGroceryLists", authMiddleware, groceryListController.getAllGroceryLists);
router.post("/addGroceryList", authMiddleware, groceryListController.addGroceryList);
router.delete("/deleteGroceryList/:id", authMiddleware, groceryListController.deleteGroceryList);
router.get("/getGroceryListItems/:id", authMiddleware, groceryListController.getGroceryListItems);
router.put("/setGroceryList/:id", authMiddleware, groceryListController.setGroceryList);

module.exports = router;