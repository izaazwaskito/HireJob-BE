const express = require("express");
const router = express.Router();
const uploadWorker = require("../middlewares/uploadWorker");
const workerController = require("../controller/worker");
router
  .post("/register", workerController.registerWorker)
  .post("/login", workerController.loginWorker)
  .get("/profile/:id", workerController.getSelectWorker)
  .get("/profile", workerController.getAllWorker)
  .put("/profile/:id", workerController.updateWorker)
  .put("/profilephoto/:id", uploadWorker, workerController.updateAvatarWorker)
  .delete("/profile/:id", workerController.deleteWorker);
module.exports = router;
