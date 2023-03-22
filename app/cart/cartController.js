const productModel = require("../product/productModel");
const cartItem = require("../cartItem/cartItemModel");

const update = async (req, res, next) => {
  try {
    const { items } = req.body;
    const productIds = items.map((item) => item.product._id);
    const products = await productModel.find({ _id: { $in: productIds } });
    let cartItems = items.map((item) => {
      let relatedProduct = products.find((product) => product._id.toString() === item.product._id);
      return {
        product: relatedProduct._id,
        price: relatedProduct.price,
        image_url: relatedProduct.image_url,
        name: relatedProduct.name,
        user: req.user._id,
        qty: item.qty,
      };
    });

    await cartItem.deleteMany({ user: req.user._id });
    await cartItem.bulkWrite(
      cartItems.map((item) => {
        return {
          updateOne: {
            filter: {
              user: req.user._id,
              product: item.product,
            },
            update: item,
            upsert: true,
          },
        };
      })
    );
    return res.json(cartItems);
  } catch (error) {
    if (error && error.name === `ValidationError`) {
      return res.json({ error: 1, message: error.message, fields: error.errors });
    }
    next(error);
  }
};

const index = async (req, res, next) => {
  try {
    let items = await cartItem.find({ user: req.user._id }).populate("product");
    return res.json(items);
  } catch (error) {
    if (error && error.name === `ValidationError`) {
      return res.json({ error: 1, message: error.message, fields: error.errors });
    }
    next(error);
  }
};

module.exports = { update, index };
