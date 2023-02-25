const router = require("express").Router();
const categoryController = require("./categoryController");
const { policeCheck } = require("../../middleware/index");

router.get("/categories", categoryController.getCategory);
router.post("/categories", policeCheck("create", "category"), categoryController.createCategory);
router.put("/categories/:id", policeCheck("update", "category"), categoryController.updateCategory);
router.delete("/categories/:id", policeCheck("delete", "category"), categoryController.destroyCategory);

module.exports = router;
