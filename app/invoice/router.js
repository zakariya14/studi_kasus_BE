const router = require("express").Router();
const invoiceController = require("./invoiceController");

router.get("/invoice/:order_id", invoiceController.show);
module.exports = router;
