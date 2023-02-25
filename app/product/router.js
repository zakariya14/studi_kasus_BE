const router = require("express").Router();
const multer = require("multer");
const os = require("os");
const { policeCheck } = require("../../middleware/index");
const productController = require("./productController");

router.get("/products", productController.getProducts);
router.post("/products", policeCheck("create", "Product"), productController.createProduct);
router.put(
  "/products/:id",
  multer({ dest: os.tmpdir() }).single("image"),
  policeCheck("update", "Product"),
  productController.updateProduct
);
router.delete("/products/:id", policeCheck("delete", "Product"), productController.destroyProduct);

module.exports = router;
