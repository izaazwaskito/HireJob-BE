const express = require("express");
const router = express.Router();
const skillController = require("../controller/skill");
router
  .post("/", skillController.createSkill)
  .get("/", skillController.getAllSkill)
  .get("/profile/:id", skillController.getSelectSkillUser)
  .put("/:id", skillController.updateSkill)
  .delete("/:id", skillController.deleteSkill);
module.exports = router;
