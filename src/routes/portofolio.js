const express = require("express");
const router = express.Router();
const uploadPortofolio = require("../middlewares/uploadPortofolio");
const portofolioController = require("../controller/portofolio.js");
router
  .post("/", uploadPortofolio, portofolioController.createPortofolio)
  .get("/", portofolioController.getAllPortofolio)
  .get("/profile/:id", portofolioController.getSelectPortofolioUser)
  .put("/:id", uploadPortofolio, portofolioController.updatePortofolio)
  .delete("/:id", portofolioController.deletePortofolio);
module.exports = router;
