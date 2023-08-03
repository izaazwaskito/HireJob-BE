const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const authHelper = require("../helper/auth");
const commonHelper = require("../helper/common");
const cloudinary = require("../middlewares/cloudinary");
let {
  selectAllRecruiter,
  selectRecruiter,
  deleteRecruiter,
  createRecruiter,
  updateRecruiter,
  updateAvatarRecruiter,
  findUUID,
  findEmail,
  countData,
} = require("../model/recruiter");

let recruiterController = {
  getAllRecruiter: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "rec_id";
      const sort = req.query.sort || "ASC";
      let result = await selectAllRecruiter({ limit, offset, sort, sortby });
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
        "Get Recruiter Data Success",
        pagination
      );
    } catch (err) {
      console.log(err);
    }
  },

  getSelectRecruiter: async (req, res) => {
    const rec_id = String(req.params.id);

    selectRecruiter(rec_id)
      .then((result) => {
        commonHelper.response(
          res,
          result.rows,
          200,
          "Get Recruiter Detail Success"
        );
      })
      .catch((err) => res.send(err));
  },

  registerRecruiter: async (req, res) => {
    const {
      rec_name,
      rec_email,
      rec_compname,
      rec_position,
      rec_phone,
      rec_password,
      rec_confirmpassword,
    } = req.body;
    const { rowCount } = await findEmail(rec_email);
    if (rowCount) {
      return res.json({ message: "Email Already Taken" });
    }

    const rec_id = uuidv4();
    // let users_photo = null;
    // if (req.file) {
    //   const result = await cloudinary.uploader.upload(req.file.path);
    //   users_photo = result.secure_url;
    // }
    const schema = Joi.object().keys({
      rec_name: Joi.required(),
      rec_email: Joi.string().required(),
      rec_phone: Joi.any(),
      rec_compname: Joi.any(),
      rec_position: Joi.any(),
      rec_password: Joi.string().min(3).max(15).required(),
      rec_confirmpassword: Joi.ref("rec_password"),
      // users_photo: Joi.string().allow(""),
    });
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      console.log(error);
      return res.send(error.details);
    }
    const rec_confirmpasswordHash = bcrypt.hashSync(rec_confirmpassword);
    const data = {
      rec_id,
      rec_name,
      rec_email,
      rec_compname,
      rec_position,
      rec_phone,
      rec_password,
      rec_confirmpasswordHash,
    };
    createRecruiter(data)
      .then((result) =>
        commonHelper.response(res, result.rows, 201, "Register Success")
      )
      .catch((err) => res.send(err));
  },

  updateRecruiter: async (req, res) => {
    try {
      const {
        rec_jobfield,
        rec_province,
        rec_city,
        rec_desc,
        rec_emailcomp,
        rec_linkedin,
      } = req.body;
      const rec_id = String(req.params.id);
      const { rowCount } = await findUUID(rec_id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      const data = {
        rec_id,
        rec_jobfield,
        rec_province,
        rec_city,
        rec_desc,
        rec_emailcomp,
        rec_linkedin,
      };
      updateRecruiter(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Update Users Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  updateAvatarRecruiter: async (req, res) => {
    try {
      const rec_id = String(req.params.id);
      const { rowCount } = await findUUID(rec_id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      let rec_photo = null;
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        rec_photo = result.secure_url;
      }
      const data = {
        rec_id,
        rec_photo,
      };
      updateAvatarRecruiter(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Update Users Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  deleteRecruiter: async (req, res) => {
    try {
      const rec_id = String(req.params.id);
      const { rowCount } = await findUUID(rec_id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      deleteRecruiter(rec_id)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Delete Users Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  loginRecruiter: async (req, res) => {
    const { rec_email, rec_confirmpassword } = req.body;
    const {
      rows: [users],
    } = await findEmail(rec_email);
    if (!users) {
      return res.json({ message: "Enter a valid email" });
    }
    const isValidPassword = bcrypt.compareSync(
      rec_confirmpassword,
      users.rec_confirmpassword
    );
    if (!isValidPassword) {
      return res.json({ message: "Wrong password" });
    }
    delete users.rec_confirmpassword;
    const payload = {
      rec_email: users.rec_email,
    };
    users.token_user = authHelper.generateToken(payload);
    users.refreshToken = authHelper.generateRefreshToken(payload);
    commonHelper.response(res, users, 201, "Login Successfuly");
  },

  refreshToken: (req, res) => {
    const refreshToken = req.body.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.SECRETE_KEY_JWT);
    const payload = {
      users_email: decoded.users_email,
    };
    const result = {
      token_user: authHelper.generateToken(payload),
      refreshToken: authHelper.generateRefreshToken(payload),
    };
    commonHelper.response(res, result, 200);
  },
};

module.exports = recruiterController;
