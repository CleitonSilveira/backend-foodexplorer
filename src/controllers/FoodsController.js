const knex = require("../database/knex");

const AppError = require("../utils/AppError");

const DiskStorage = require("../providers/DiskStorage");

class FoodsController {

  async create(req, res) {

    const diskStorage = new DiskStorage;

    const { name, description, price, ingredients, category } = req.body;
    
    const user_id = req.user.id;

    const checkIfIsAdmin = await knex("users").select("isAdmin").where("id", user_id).first();

    if(checkIfIsAdmin.isAdmin !== 1) {
      throw new AppError("Acesso negado")
    }    
    
    const [food_id] = await knex("foods").insert({
      name,
      description,
      price,
      user_id,
      category
    });
    
    const ingredientsInsert = ingredients.map(ingredient => {
      return {
        food_id,
        user_id,
        name: ingredient
      }
    });

    await knex("ingredients").insert(ingredientsInsert);
    
    res.json(food_id);
  }

  async update(req, res) {

    let { name, description, price, ingredients, category } = req.body;

    const { food_id } = req.params;

    const user_id = req.user.id;

    const food = await knex("foods").where("id", food_id).first();
    if(!food) {
      throw new AppError("Prato não encontrado");
    }    

    if(!name) {
      name = food.name;
    }

    if(!description) {
      description = food.description;
    }

    if(!price) {
      price = food.price;
    }

    if(!category) {
      category = food.category;
    }

    if(ingredients) {
      await knex("ingredients").where("food_id", food.id).delete();
    }

    await knex("foods")
    .where("id", food_id)
    .update({
      name,
      description,
      price,
      category
    });

    const ingredientsArray = ingredients.map(ingredient => {
      if(ingredient.name) {
        return ingredient.name
      } else {
        return ingredient
      }
    });    
    
    ingredientsArray.map(
      async (ingredient) => 
      await knex("ingredients")
      .insert({
        name: ingredient,
        food_id: food.id,
        user_id
      })
      )    

    return res.json();
  }

  async delete(req, res) {

    const { food_id } = req.params;

    const diskStorage = new DiskStorage;

    const food = await knex("foods").where("id", food_id).first();

    await diskStorage.deleteFile(food.image);

    await knex("foods").where("id", food_id).delete();

    return res.json();
  }

  async show(req, res) {

    const {food_id} = req.params;

    const food = await knex("foods").where("id", food_id).first();

    const ingredients = await knex("ingredients").where({food_id}).orderBy("name");

    if(!food) {
      throw new AppError("Prato não encontrado");
    }

    return res.json({
      ...food,
      ingredients
    });
  }

  async index(req, res) {

    const { search } = req.query;
  
    const foods = await knex("foods")
      .select([
        "foods.id",
        "foods.name",
        "foods.price",
        "foods.description",
        "foods.category",
        "foods.image"
      ])
      .leftJoin("ingredients", "foods.id", "ingredients.food_id")
      .where(function() {
        this.where("foods.name", "like", `%${search}%`)
          .orWhere("ingredients.name", "like", `%${search}%`);
      })
      .groupBy("foods.id")
      .orderBy("foods.name");
  
    const allIngredients = await knex("ingredients");
    
    const foodWithIngredients = foods.map(food => {
      const foodIngredients = allIngredients.filter(ingredient => ingredient.food_id === food.id);
    
      return {
        ...food,
        ingredients: foodIngredients.map(ingredient => ingredient.name)
      };
    });
    
    return res.json(foodWithIngredients);
  }
};

module.exports = FoodsController;