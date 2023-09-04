const express = require("express");
const router = express.Router();
const hireController = require("../controller/hire");
router
  .post("/", hireController.createHire)
  .get("/", hireController.getAllHire)
  .get("/worker/:id", hireController.getSelectHireWorker)
  .get("/recruiter/:id", hireController.getSelectHireRecruiter)
  // .put("/:id", hireController.updatehire)
  .delete("/:id", hireController.deleteHire);
module.exports = router;
