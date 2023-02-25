const { subject } = require("@casl/ability");
const { policyFor } = require("../../utils");
const DeliveryAddressModel = require("./deliveryAddressModel");

const store = async (req, res, next) => {
  try {
    let payload = req.body;
    let user = req.user;
    let address = new DeliveryAddressModel({ ...payload, user: user._id });
    await address.save();
    return res.json(address);
  } catch (error) {
    if (error && error.name === `ValidationError`) {
      return res.json({ error: 1, message: error.message, fields: error.errors });
    }
    next(error);
  }
};

const index = async (req, res, next) => {
  try {
    let { skip = 0, limit = 10 } = req.query;
    let count = await DeliveryAddressModel.find({ user: req.user._id }).countDocuments();
    let address = await DeliveryAddressModel.find({ user: req.user._id }).skip(parseInt(skip)).limit(parseInt(limit)).sort("-createdAt");
  } catch (error) {
    if (error && error.name === `ValidationError`) {
      return res.json({ error: 1, message: error.message, fields: error.errors });
    }
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    let { _id, ...payload } = req.body;
    let { id } = req.params;
    let address = await DeliveryAddressModel.findById(id);
    let policy = policyFor(req.user);
    let subjectAddress = subject("DeliveryAddress", { ...address, user_id: address.user });
    if (!policy.can("update", subjectAddress)) {
      return res.json({ error: 1, message: "You are not allowed to modify this resource" });
    }
    address = await DeliveryAddressModel.findByIdAndUpdate(id, payload, { new: true });
    res.json(address);
  } catch (error) {
    if (error && error.name === `ValidationError`) {
      return res.json({ error: 1, message: error.message, fields: error.errors });
    }
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    let { id } = req.params;
    let address = await DeliveryAddressModel.findById(id);
    let subjectAddress = subject("DeliveryAddress", { ...address, user_id: user.id });
    let policy = policyFor(req.user);
    if (!policy.can("delete", subjectAddress)) {
      return res.json({ error: 1, message: "You are not allowed to delete this resource" });
    }
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
