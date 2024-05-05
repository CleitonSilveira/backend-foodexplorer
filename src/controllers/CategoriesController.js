const knex = require("../database/knex");

class CategoriesController {

  async create(req, res) {
    const { name } = req.body;
    const user_id = req.user.id;

    await knex("categories").insert({name, user_id});

    return res.json();
  }

  async index(req, res) {
    
    const categories = await knex("categories");

    return res.json(categories);
  }
}

module.exports = CategoriesController;