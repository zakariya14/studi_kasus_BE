const tagModel = require("./tagModel");

const store = async (req, res, next) => {
  try {
    let payload = req.body;
    let tag = new tagModel(payload);
    await tag.save();
    return res.json(tag);
  } catch (error) {
    if (error && error.name === `ValidationError`) {
      return res.json({ error: 1, message: error.message, fields: error.errors });
    }
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    let payload = req.body;
    let tag = await tagModel.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    return res.json(tag);
  } catch (error) {
    if (error && error.name === `ValidationError`) {
      return res.json({ error: 1, message: error.message, fields: error.errors });
    }
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    let tag = await tagModel.findByIdAndDelete(req.params.id);
    return res.json(tag);
  } catch (error) {
    if (error && error.name === `ValidationError`) {
      return res.json({ error: 1, message: error.message, fields: error.errors });
    }
    next(error);
  }
};

const index = async (req, res, next) => {
  try {
    let tag = await tagModel.find();
    // let tag = await tagModel.find().toArray()
    return res.json(tag);
  } catch (error) {
    if (error && error.name === `ValidationError`) {
      return res.json({ error: 1, message: error.message, fields: error.errors });
    }
    next(error);
  }
};

module.exports = {
  store,
  index,
  update,
  destroy,
};
