const { v4: uuidv4 } = require("uuid");
const commonHelper = require("../helper/common");
const cloudinary = require("../middlewares/cloudinary");
let {
  selectAllPortofolio,
  selectPortofolioUsers,
  deletePortofolio,
  createPortofolio,
  updatePortofolio,
  findUUID,
  countData,
} = require("../model/portofolio");

let portofolioController = {
  getAllPortofolio: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "por_id";
      const sort = req.query.sort || "ASC";
      let result = await selectAllPortofolio({ limit, offset, sort, sortby });
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

  getSelectPortofolioUser: async (req, res) => {
    const wrk_id = String(req.params.id);
    selectPortofolioUsers(wrk_id)
      .then((result) => {
        commonHelper.response(
          res,
          result.rows,
          200,
          "Get Portofolio Detail Success"
        );
      })
      .catch((err) => res.send(err));
  },

  createPortofolio: async (req, res) => {
    const { por_name, por_repository, wrk_id } = req.body;
    const por_id = uuidv4();
    let por_photo = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      por_photo = result.secure_url;
    }

    const data = {
      por_id,
      por_name,
      por_repository,
      por_photo,
      wrk_id,
    };
    createPortofolio(data)
      .then((result) =>
        commonHelper.response(
          res,
          result.rows,
          201,
          "Create Portofolio Success"
        )
      )
      .catch((err) => res.send(err));
  },

  updatePortofolio: async (req, res) => {
    try {
      const { por_name, por_repository } = req.body;
      const por_id = String(req.params.id);
      const { rowCount } = await findUUID(por_id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      let por_photo = null;
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        por_photo = result.secure_url;
      }
      const data = {
        por_id,
        por_name,
        por_repository,
        por_photo,
      };

      updatePortofolio(data)
        .then((result) =>
          commonHelper.response(
            res,
            result.rows,
            200,
            "Update Portofolio Success"
          )
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  deletePortofolio: async (req, res) => {
    try {
      const por_id = String(req.params.id);
      const { rowCount } = await findUUID(por_id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      deletePortofolio(por_id)
        .then((result) =>
          commonHelper.response(
            res,
            result.rows,
            200,
            "Delete Portofolio Success"
          )
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = portofolioController;
