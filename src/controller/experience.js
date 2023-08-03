const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const authHelper = require("../helper/auth");
const commonHelper = require("../helper/common");
// const cloudinary = require("../middlewares/cloudinary");
let {
  selectAllExperience,
  selectExperienceUsers,
  deleteExperience,
  createExperience,
  updateExperience,
  findUUID,
  countData,
} = require("../model/experience");

let experienceController = {
  getAllExperience: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "exp_id";
      const sort = req.query.sort || "ASC";
      let result = await selectAllExperience({ limit, offset, sort, sortby });
      const {
        rows: [count],
      } = await countData();
      const totalData = parseInt(count.count);
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        currentPage: page,
        limit: limit,
        totalData: totalData,
        totalPage: totalPage,
      };
      commonHelper.response(
        res,
        result.rows,
        200,
        "Get Experience Data Success",
        pagination
      );
    } catch (err) {
      console.log(err);
    }
  },

  getSelectExperienceUser: async (req, res) => {
    const wrk_id = String(req.params.id);
    selectExperienceUsers(wrk_id)
      .then((result) => {
        commonHelper.response(
          res,
          result.rows,
          200,
          "Get Experience Detail Success"
        );
      })
      .catch((err) => res.send(err));
  },

  createExperience: async (req, res) => {
    const {
      exp_position,
      exp_compname,
      exp_datefrom,
      exp_dateuntil,
      exp_desc,
      wrk_id,
    } = req.body;

    const exp_id = uuidv4();

    const data = {
      exp_id,
      exp_position,
      exp_compname,
      exp_datefrom,
      exp_dateuntil,
      exp_desc,
      wrk_id,
    };
    createExperience(data)
      .then((result) =>
        commonHelper.response(
          res,
          result.rows,
          201,
          "Create Experience Success"
        )
      )
      .catch((err) => res.send(err));
  },

  updateExperience: async (req, res) => {
    try {
      const {
        exp_position,
        exp_compname,
        exp_datefrom,
        exp_dateuntil,
        exp_desc,
      } = req.body;
      const exp_id = String(req.params.id);
      const { rowCount } = await findUUID(exp_id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      const data = {
        exp_id,
        exp_position,
        exp_compname,
        exp_datefrom,
        exp_dateuntil,
        exp_desc,
      };

      updateExperience(data)
        .then((result) =>
          commonHelper.response(
            res,
            result.rows,
            200,
            "Update Experience Success"
          )
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  deleteExperience: async (req, res) => {
    try {
      const exp_id = String(req.params.id);
      const { rowCount } = await findUUID(exp_id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      deleteExperience(exp_id)
        .then((result) =>
          commonHelper.response(
            res,
            result.rows,
            200,
            "Delete Experience Success"
          )
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = experienceController;
