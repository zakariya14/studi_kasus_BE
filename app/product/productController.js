const path = require("path");
const fs = require("fs");
const config = require("../config");
const productModel = require("./productModel");
const categoryModel = require("../category/categoryModel");
const tagModel = require("../tag/tagModel");

const createProduct = async (req, res, next) => {
  try {
    let payload = req.body;

    // update relation category
    if (payload.category) {
      let category = await categoryModel.findOne({ name: { $regex: payload.category, $options: "i" } });
      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }

    // update relation tags
    if (payload.tags && payload.tags.length > 0) {
      let tags = await tagModel.find({ name: { $in: payload.tags } });
      if (tags.length) {
        payload = { ...payload, tags: tags.map((tag) => tag._id) };
      } else {
        delete payload.tags;
      }
    }

    if (req.file) {
      let tmpPath = req.file.path;
      let originalExt = req.file.originalname.split(".")[req.file.originalname.split(".").length - 1];
      let fileName = req.file.filename + "." + originalExt;
      let targetPath = path.resolve(config.rootPath, `public/images/products/${fileName}`);

      const src = fs.createReadStream(tmpPath);
      const dest = fs.createWriteStream(targetPath);
      src.pipe(dest);

      src.on(`end`, async () => {
        try {
          let product = new productModel({ ...payload, image_url: fileName });
          await product.save();
          return res.json(product);
        } catch (err) {
          fs.unlinkSync(targetPath);
          if (err && err.name === "ValidationError") {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors,
            });
          }
          next(err);
        }
      });
      src.on(`error`, async () => {
        next(err);
      });
    } else {
      let product = new productModel(payload);
      await product.save();
      return res.json(product);
    }
  } catch (err) {
    if (err && err.name === `ValidationError`) {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const getProducts = async (req, res, next) => {
  try {
    let { skip = 0, limit = 10, q = "", category = "", tags = [] } = req.query;
    let criteria = {};

    if (q.length) {
      criteria = {
        ...criteria,
        name: { $regex: `${q}`, $options: "i" },
      };
    }

    if (category.length) {
      // let categoryResult = await categoryModel.findOne({ name: { $regex: `${category}` }, $options: "i" });
      let categoryResult = await categoryModel.findOne({ name: { $regex: `${category}`, $options: "i" } });
      if (categoryResult) {
        criteria = { ...criteria, category: categoryResult._id };
      }
    }

    if (tags.length) {
      let tagsResult = await tagModel.find({ name: { $in: tags } });
      if (tagsResult.length > 0) {
        criteria = { ...criteria, tags: { $in: tagsResult.map((tag) => tag._id) } };
      }
    }

    // console.log(criteria);
    let count = await productModel.find().countDocuments();

    let product = await productModel.find(criteria).skip(parseInt(skip)).limit(parseInt(limit)).populate("category").populate("tags");
    return res.json({
      data: product,
      count,
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    let payload = req.body;
    let { id } = req.params;

    // update relation category
    if (payload.category) {
      let category = await categoryModel.findOne({ name: { $regex: new RegExp(payload.category, "i") } });
      // let category = await categoryModel.findOne({ name: { $regex: payload.category, $options: "i" } });
      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }

    // update relation tags
    if (payload.tags && payload.tags.length > 0) {
      let tags = await tagModel.find({ name: { $in: payload.tags } });
      if (tags.length) {
        payload = { ...payload, tags: tags.map((tag) => tag._id) };
      } else {
        delete payload.tags;
      }
    }

    if (req.file) {
      let tmpPath = req.file.path;
      let originalExt = req.file.originalname.split(".")[req.file.originalname.split(".").length - 1];
      let fileName = req.file.filename + "." + originalExt;
      let targetPath = path.resolve(config.rootPath, `public/images/products/${fileName}`);

      const src = fs.createReadStream(tmpPath);
      const dest = fs.createWriteStream(targetPath);
      src.pipe(dest);

      src.on(`end`, async () => {
        try {
          let product = await productModel.findById(id);
          let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`;

          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          }
          product = await productModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
          return res.json(product);
        } catch (err) {
          fs.unlinkSync(targetPath);
          if (err && err.name === "ValidationError") {
            return resizeBy.json({
              error: 1,
              message: err.message,
              fields: err.errors,
            });
          }
          next(err);
        }
      });
      src.on(`error`, async () => {
        next(err);
      });
    } else {
      let product = await productModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
      return res.json(product);
    }
  } catch (err) {
    if (err && err.name === `ValidationError`) {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const destroyProduct = async (req, res, next) => {
  try {
    let product = await productModel.findByIdAndDelete(req.params.id);
    let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`;

    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }

    return res.json(product);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  destroyProduct,
};
