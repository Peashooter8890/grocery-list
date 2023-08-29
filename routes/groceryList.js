const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const groceryListController = require('../controllers/groceryListController');

router.get("/getAllGroceryLists", authMiddleware, groceryListController.getAllGroceryLists);
router.post("/addGroceryList", authMiddleware, groceryListController.addGroceryList);
router.put("/renameGroceryList/:id", authMiddleware, groceryListController.renameGroceryList);
router.get("/getGroceryList/:id", authMiddleware, groceryListController.getGroceryList);
router.put("/updateGroceryList/:id", authMiddleware, groceryListController.updateGroceryList);
router.delete("/deleteGroceryList/:id", authMiddleware, groceryListController.deleteGroceryList);

module.exports = router;