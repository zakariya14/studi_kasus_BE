const { policeCheck } = require("../../middleware");
const deliveryAddressController = require("./deliveryAddressController");
const router = require("express").Router();

router.get("/delivery-addresses", policeCheck("view", "DeliveryAddress"), deliveryAddressController.index);
router.post("/delivery-addresses", policeCheck("create", "DeliveryAddress"), deliveryAddressController.store);
router.put("/delivery-addresses/:id", policeCheck("update", "DeliveryAddress"), deliveryAddressController.update);
router.delete("/delivery-addresses/:id", policeCheck("delete", "DeliveryAddress"), deliveryAddressController.destroy);

module.exports = router;
