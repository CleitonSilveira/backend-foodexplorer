const { Router } = require("express");

const routes = Router();

const categoriesRouter = require("./categories.routes");
const foodsCategoryRouter = require("./foodsCategory.routes");
const foodImgRoutes = require("./foodsImage.routes");
const foodsRouter = require("./foods.routes");
const sessionsRouter = require("./sessions.routes");
const usersRouter = require("./users.routes");

routes.use("/users", usersRouter);
routes.use("/foods", foodsRouter);
routes.use("/categories", categoriesRouter);
routes.use("/foodsCategory", foodsCategoryRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/foodimage", foodImgRoutes);

module.exports = routes;