const knex = require("../database/knex");

const AppError = require("../utils/AppError");

class FoodsCategoryController {

  async index(req, res) {
    
    const { category } = req.query;

    const foods = await knex("foods")
    .whereLike("category", `%${category}%`)
    .orderBy("name");

    return res.json(foods)
  }
}

module.exports = FoodsCategoryController;