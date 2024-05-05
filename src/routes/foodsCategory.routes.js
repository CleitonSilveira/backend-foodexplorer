const { Router } = require("express");

const FoodsCategoryController = require("../controllers/FoodsCategoryController");

const foodsCategoryRoutes = Router();

const ensureAuth = require("../middleware/ensureAuth");

const foodsCategoriesController = new FoodsCategoryController();

foodsCategoryRoutes.get("/", ensureAuth, foodsCategoriesController.index);

module.exports = foodsCategoryRoutes;