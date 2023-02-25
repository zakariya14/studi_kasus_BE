const { getToken, policyFor } = require("../utils");
const jwt = require("jsonwebtoken");
const config = require("../app/config");
const userModel = require("../app/user/userModel");

function decodeToken() {
  return async function (req, res, next) {
    try {
      let token = getToken(req);

      if (!token) return next();

      req.user = jwt.verify(token, config.secretKey);

      let user = await userModel.findOne({ token: { $in: [token] } });
      if (!user) {
        res.json({ error: 1, message: "Token Expired" });
      }
    } catch (error) {
      if (error && error.name === `JsonWebTokenError`) {
        return res.json({ error: 1, message: error.message });
      }
      next(error);
    }

    return next();
  };
}

// untuk cek hak akses
function policeCheck(action, subject) {
  return function (req, res, next) {
    let policy = policyFor(req.user);
    if (!policy.can(action, subject)) {
      return res.json({ error: 1, message: `You're not allowed to ${action}${subject}` });
    }
    next();
  };
}

module.exports = {
  decodeToken,
  policeCheck,
};
