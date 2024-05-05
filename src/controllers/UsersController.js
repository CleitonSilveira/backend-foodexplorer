const { hash } = require("bcryptjs");

const knex = require("../database/knex");

const AppError = require("../utils/AppError");

class UsersController {
  async create(req, res) {

    const { name, email, password, isAdmin } = req.body;

    const checkIfEmailIsUsed = await knex("users").where({email}).first();

    if(checkIfEmailIsUsed) {
      throw new AppError("Email já está cadastrado");
    }

    const hashedPassword = await hash(password, 8);

    const user_id = await knex("users").insert({
      name,
      email,
      password: hashedPassword,
      isAdmin
    })
    res.json(user_id);
  }
};

module.exports = UsersController;