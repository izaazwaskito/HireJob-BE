const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const authHelper = require("../helper/auth");
const commonHelper = require("../helper/common");
const cloudinary = require("../middlewares/cloudinary");
const crypto = require("crypto");
let {
  selectAllRecruiter,
  selectRecruiter,
  deleteRecruiter,
  createRecruiter,
  updateRecruiter,
  updateAvatarRecruiter,
  createRecruiterVerification,
  checkRecruiterVerification,
  cekRecruiter,
  deleteRecruiterVerification,
  updateAccountVerification,
  findUUID,
  findEmail,
  countData,
} = require("../model/recruiter");
const sendemailrecruiter = require("../middlewares/sendemailrecruiter");

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
    const checkEmail = await findEmail(rec_email);
    try {
      if (checkEmail.rowCount == 1) throw "Email already used";
      // delete checkEmail.rows[0].password;
    } catch (error) {
      delete checkEmail.rows[0].password;
      return commonHelper.response(res, null, 403, error);
    }

    const rec_confirmpasswordHash = bcrypt.hashSync(rec_confirmpassword);
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

    const verify = "false";
    const recruiter_verification_id = uuidv4().toLocaleLowerCase();
    const recruiter_id = rec_id;
    const token = crypto.randomBytes(64).toString("hex");
    const url = `${process.env.BASE_URL}recruiter/verify?id=${recruiter_id}&token=${token}`;

    await sendemailrecruiter(rec_compname, rec_email, "Verify Email", url);

    const data = {
      rec_id,
      rec_name,
      rec_email,
      rec_compname,
      rec_position,
      rec_phone,
      rec_password,
      rec_confirmpasswordHash,
      verify,
    };

    createRecruiter(data);

    await createRecruiterVerification(
      recruiter_verification_id,
      recruiter_id,
      token
    );

    commonHelper.response(
      res,
      null,
      201,
      "Sign Up Success, Please check your email for verification"
    );
  },

  VerifyAccount: async (req, res) => {
    try {
      const queryUsersId = req.query.id;
      const queryToken = req.query.token;

      if (typeof queryUsersId === "string" && typeof queryToken === "string") {
        const checkUsersVerify = await findUUID(queryUsersId);

        if (checkUsersVerify.rowCount == 0) {
          return commonHelper.response(
            res,
            null,
            403,
            "Error users has not found"
          );
        }

        if (checkUsersVerify.rows[0].verify != "false") {
          return commonHelper.response(
            res,
            null,
            403,
            "Users has been verified"
          );
        }

        const result = await checkRecruiterVerification(
          queryUsersId,
          queryToken
        );

        if (result.rowCount == 0) {
          return commonHelper.response(
            res,
            null,
            403,
            "Error invalid credential verification"
          );
        } else {
          await updateAccountVerification(queryUsersId);
          await deleteRecruiterVerification(queryUsersId, queryToken);
          commonHelper.response(res, null, 200, "Users verified succesful");
        }
      } else {
        return commonHelper.response(
          res,
          null,
          403,
          "Invalid url verification"
        );
      }
    } catch (error) {
      console.log(error);

      // res.send(createError(404));
    }
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
      rows: [verify],
    } = await cekRecruiter(rec_email);
    if (verify.verify === "false") {
      return res.json({
        message: "recruiter is unverify",
      });
    }
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
