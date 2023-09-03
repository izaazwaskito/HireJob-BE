const { v4: uuidv4 } = require("uuid");
const commonHelper = require("../helper/common");

const cloudinary = require("../middlewares/cloudinary");
let {
  selectAllSkill,
  selectSkillUsers,
  deleteSkill,
  createSkill,
  updateSkill,
  findUUID,
  findUser,
  findSkill,
  countData,
} = require("../model/skill");

let skillController = {
  getAllSkill: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "skill_id";
      const sort = req.query.sort || "ASC";
      let result = await selectAllSkill({ limit, offset, sort, sortby });
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
        "Get Portofolio Data Success",
        pagination
      );
    } catch (err) {
      console.log(err);
    }
  },

  getSelectSkillUser: async (req, res) => {
    const wrk_id = String(req.params.id);
    selectSkillUsers(wrk_id)
      .then((result) => {
        commonHelper.response(
          res,
          result.rows,
          200,
          "Get Skill Detail Success"
        );
      })
      .catch((err) => res.send(err));
  },

  createSkill: async (req, res) => {
    const { skill_name, wrk_id } = req.body;
    const { rowCount: SkillName } = await findSkill(skill_name, wrk_id);
    // const { rowCount: WorkerID } = await findUser(wrk_id);

    if (SkillName) {
      return res.json({ message: "Skill Already" });
    }
    const skill_id = uuidv4();
    const data = {
      skill_id,
      skill_name,
      wrk_id,
    };
    createSkill(data)
      .then((result) =>
        commonHelper.response(res, result.rows, 201, "Create Skill Success")
      )
      .catch((err) => res.send(err));
  },

  updateSkill: async (req, res) => {
    try {
      const { skill_name } = req.body;
      const skill_id = String(req.params.id);
      const { rowCount } = await findUUID(por_id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      const data = {
        skill_id,
        skill_name,
      };

      updateSkill(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Update Skill Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  deleteSkill: async (req, res) => {
    try {
      const skill_id = String(req.params.id);
      const { rowCount } = await findUUID(skill_id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      deleteSkill(skill_id)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Delete Skill Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = skillController;
