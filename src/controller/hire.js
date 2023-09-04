const { v4: uuidv4 } = require("uuid");
const commonHelper = require("../helper/common");
let {
  selectAllHire,
  selectHireWorker,
  selectHireRecruiter,
  deleteHire,
  createHire,
  findUUID,
  countData,
} = require("../model/hire");
const sendemailoffer = require("../middlewares/sendemailoffer");

let hireController = {
  getAllHire: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "hire_id";
      const sort = req.query.sort || "ASC";
      let result = await selectAllHire({ limit, offset, sort, sortby });
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
        "Get Hire Data Success",
        pagination
      );
    } catch (err) {
      console.log(err);
    }
  },

  getSelectHireWorker: async (req, res) => {
    const wrk_id = String(req.params.id);
    selectHireWorker(wrk_id)
      .then((result) => {
        commonHelper.response(res, result.rows, 200, "Get Hire Detail Success");
      })
      .catch((err) => res.send(err));
  },

  getSelectHireRecruiter: async (req, res) => {
    const rec_id = String(req.params.id);
    selectHireRecruiter(rec_id)
      .then((result) => {
        commonHelper.response(res, result.rows, 200, "Get Hire Detail Success");
      })
      .catch((err) => res.send(err));
  },

  createHire: async (req, res) => {
    const {
      hire_title,
      hire_desc,
      wrk_id,
      rec_id,
      wrk_name,
      wrk_email,
      rec_compname,
    } = req.body;
    const hire_id = uuidv4();
    const data = {
      hire_id,
      hire_title,
      hire_desc,
      wrk_name,
      wrk_id,
      wrk_email,
      rec_id,
      rec_compname,
    };

    await sendemailoffer(
      rec_compname,
      wrk_email,
      wrk_name,
      hire_title,
      hire_desc,
      `Job Offer: ${hire_title} at ${rec_compname}`
    );

    createHire(data)
      .then((result) =>
        commonHelper.response(res, result.rows, 201, "Create Hire Success")
      )
      .catch((err) => res.send(err));
  },

  // updateSkill: async (req, res) => {
  //   try {
  //     const { skill_name } = req.body;
  //     const skill_id = String(req.params.id);
  //     const { rowCount } = await findUUID(por_id);
  //     if (!rowCount) {
  //       res.json({ message: "ID Not Found" });
  //     }
  //     const data = {
  //       skill_id,
  //       skill_name,
  //     };

  //     updateSkill(data)
  //       .then((result) =>
  //         commonHelper.response(res, result.rows, 200, "Update Skill Success")
  //       )
  //       .catch((err) => res.send(err));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },

  deleteHire: async (req, res) => {
    try {
      const hire_id = String(req.params.id);
      const { rowCount } = await findUUID(hire_id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      deleteHire(hire_id)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Delete Hire Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = hireController;
