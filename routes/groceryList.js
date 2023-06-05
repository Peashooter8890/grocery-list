const router = require('express').Router();
const groceryListController = require('../controllers/groceryListController');

router.get("/getGroceryList", groceryListController.getGroceryList);
router.post("/setGroceryList", groceryListController.setGroceryList);

module.exports = router;