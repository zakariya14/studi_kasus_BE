const router = require("express").Router();
const { policeCheck } = require("../../middleware");
const tagController = require("./tagController");

router.get("/tags", tagController.index);
router.post("/tags", policeCheck("create", "Tag"), tagController.store);
router.put("/tags/:id", policeCheck("update", "Tag"), tagController.update);
router.delete("/tags/:id", policeCheck("delete", "Tag"), tagController.destroy);

module.exports = router;
