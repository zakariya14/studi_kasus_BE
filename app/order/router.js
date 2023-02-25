const router = require("express").Router();
const { policeCheck } = require("../../middleware");
const orderController = require("../order/orderController");

router.post("/orders", policeCheck("create", "Order"), orderController.store);
router.get("/orders", policeCheck("view", "Order"), orderController.index);

module.exports = router;
