const knex = require("../database/knex");

const AppError = require("../utils/AppError");

const DiskStorage = require("../providers/DiskStorage");

class FoodsImgController {

  async update(req, res) {

    const { food_id } = req.params;
    const foodImgFilename = req.file.filename;

    const diskStorage = new DiskStorage;

    const food = await knex("foods").where("id", food_id).first();

    if(!food) {
      throw new AppError("Prato não foi encontrado", 401);
    }

    if(food.image) {
      await diskStorage.deleteFile(food.image);
    }

    const filename = await diskStorage.saveFile(foodImgFilename);
    food.image = filename;

    await knex("foods").update(food).where({ id: food_id });

    return res.json(food)
  }
}

module.exports = FoodsImgController;