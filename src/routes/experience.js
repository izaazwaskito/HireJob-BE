const express = require("express");
const router = express.Router();
// const uploadUsers = require("../middlewares/uploadUsers");
const experienceController = require("../controller/experience");
router
  .post("/", experienceController.createExperience)
  .get("/", experienceController.getAllExperience)
  .get("/profile/:id", experienceController.getSelectExperienceUser)
  .put("/:id", experienceController.updateExperience)
  .delete("/:id", experienceController.deleteExperience);
module.exports = router;
