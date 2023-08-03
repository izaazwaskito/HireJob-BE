const express = require("express");
const router = express.Router();
const workerRouter = require("../routes/worker");
const recruiterRouter = require("../routes/recruiter");
const experienceRouter = require("../routes/experience");
const portofolioRouter = require("../routes/portofolio");
const skillRouter = require("../routes/skill");

router.use("/worker", workerRouter);
router.use("/recruiter", recruiterRouter);
router.use("/experience", experienceRouter);
router.use("/portofolio", portofolioRouter);
router.use("/skill", skillRouter);
module.exports = router;
