const router = require("express").Router();
const { policeCheck } = require("../../middleware");
const cartController = require("./cartController");

router.get("/carts", policeCheck("read", "Cart"), cartController.index);
router.put("/carts", policeCheck("update", "Cart"), cartController.update);

module.exports = router;
