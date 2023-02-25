const userModel = require("../user/userModel");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { getToken } = require("../../utils");

const register = async (req, res, next) => {
  try {
    const payload = req.body;
    let user = new userModel(payload);
    await user.save();
    return res.json(user);
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.json({ error: 1, message: error.message, fields: error.errors });
    }
    next(error);
  }
};

const localStrategy = async (email, password, done) => {
  try {
    let user = await userModel.findOne({ email }).select(`-createdAt -updatedAt -cart_items -token`);
    if (!user) return done(null, false, { message: "Incorrect email or password." });
    if (bcrypt.compareSync(password, user.password)) {
      ({ password, ...userWithoutPassword } = user.toJSON());
      return done(null, userWithoutPassword);
    } else {
      return done(null, false, { message: "Incorrect email or password." });
    }
  } catch (error) {
    done(error, null);
  }
};

const login = async (req, res, next) => {
  passport.authenticate("local", async function (err, user, info) {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: 1, message: info.message });

    let signed = jwt.sign(user, config.secretKey);

    try {
      await userModel.findByIdAndUpdate(user._id, { $push: { token: signed } });
      return res.json({ message: "Login successfully", user, token: signed });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

const logout = async (req, res, next) => {
  let token = getToken(req);

  let user = await userModel.findOneAndUpdate({ token: { $in: [token] } }, { $pull: { token: token } }, { useFindAndModify: false });

  if (!token || !user) {
    res.json({ error: 1, message: "No user found" });
  }

  return res.json({ error: 0, message: "Logout Berhasil" });
};

const me = (req, res, next) => {
  if (!req.user) {
    res.json({ error: 1, message: `You are not login or token expired` });
  }

  res.json(req.user);
};

module.exports = {
  register,
  localStrategy,
  login,
  logout,
  me,
};
