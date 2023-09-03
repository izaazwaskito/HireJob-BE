const express = require("express");
const router = express.Router();
const uploadRecruiter = require("../middlewares/uploadRecruiter");
const recruiterController = require("../controller/recruiter");
router
  .post("/register", recruiterController.registerRecruiter)
  .post("/login", recruiterController.loginRecruiter)
  .get("/profile/:id", recruiterController.getSelectRecruiter)
  .get("/profile", recruiterController.getAllRecruiter)
  .get("/verify", recruiterController.VerifyAccount)
  .put("/profile/:id", recruiterController.updateRecruiter)
  .put(
    "/profilephoto/:id",
    uploadRecruiter,
    recruiterController.updateAvatarRecruiter
  )
  .delete("/profile/:id", recruiterController.deleteRecruiter);
module.exports = router;
