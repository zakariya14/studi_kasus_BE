const categoryModel = require("./categoryModel");

const createCategory = async (req, res, next) => {
  try {
    let payload = req.body;
    let category = new categoryModel(payload);
    await category.save();
    return res.json(category);
  } catch (error) {
    if (error && error.name === `ValidationError`) {
      return res.json({ error: 1, message: error.message, fields: error.errors });
    }
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    let payload = req.body;
    let category = await categoryModel.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    return res.json(category);
  } catch (error) {
    if (error && error.name === `ValidationError`) {
      return res.json({ error: 1, message: error.message, fields: error.errors });
    }
    next(error);
  }
};

const destroyCategory = async (req, res, next) => {
  try {
    let category = await categoryModel.findByIdAndDelete(req.params.id);
    return res.json(category);
  } catch (error) {
    if (error && error.name === `ValidationError`) {
      return res.json({ error: 1, message: error.message, fields: error.errors });
    }
    next(error);
  }
};

const getCategory = async (req, res, next) => {
  try {
    let category = await categoryModel.find();
    // let category = await categoryModel.find().toArray()
    return res.json(category);
  } catch (error) {
    if (error && error.name === `ValidationError`) {
      return res.json({ error: 1, message: error.message, fields: error.errors });
    }
    next(error);
  }
};

module.exports = {
  createCategory,
  updateCategory,
  destroyCategory,
  getCategory,
};
