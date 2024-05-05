const { Router } = require("express");

const CategoriesController = require("../controllers/CategoriesController");

const categoriesRoutes = Router();

const categoriesController = new CategoriesController();

const ensureAuth = require("../middleware/ensureAuth");

categoriesRoutes.get("/", categoriesController.index);

categoriesRoutes.post("/", ensureAuth,categoriesController.create);

module.exports = categoriesRoutes;