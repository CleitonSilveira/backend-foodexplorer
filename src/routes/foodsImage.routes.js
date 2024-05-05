const { Router } = require("express");

const FoodsImgController = require("../controllers/FoodsImgController");

const multer = require("multer");

const ensureAuth = require("../middleware/ensureAuth");

const uploadConfig = require("../configs/upload");

const foodsImgRoutes = Router();

const upload = multer(uploadConfig.MULTER);

const foodsImgController = new FoodsImgController();

foodsImgRoutes.use(ensureAuth);

foodsImgRoutes.patch("/:food_id", upload.single("image"), foodsImgController.update);

module.exports = foodsImgRoutes;