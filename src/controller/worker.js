const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const authHelper = require("../helper/auth");
const commonHelper = require("../helper/common");
const cloudinary = require("../middlewares/cloudinary");
const crypto = require("crypto");
let {
  selectAllWorker,
  selectWorker,
  deleteWorker,
  createWorker,
  updateWorker,
  updateAvatarWorker,
  createWorkerVerification,
  checkWorkerVerification,
  cekWorker,
  deleteWorkerVerification,
  updateAccountVerification,
  findUUID,
  findEmail,
  countData,
} = require("../model/worker");
const sendemailworker = require("../middlewares/sendemailworker");

let workerController = {
  getAllWorker: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "wrk_id";
      const sort = req.query.sort || "ASC";
      let result = await selectAllWorker({ limit, offset, sort, sortby });
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
        "Get Worker Data Success",
        pagination
      );
    } catch (err) {
      console.log(err);
    }
  },

  getSelectWorker: async (req, res) => {
    const wrk_id = String(req.params.id);
    selectWorker(wrk_id)
      .then((result) => {
        commonHelper.response(
          res,
          result.rows,
          200,
          "Get Worker Detail Success"
        );
      })
      .catch((err) => res.send(err));
  },

  registerWorker: async (req, res) => {
    const {
      wrk_name,
      wrk_email,
      wrk_phone,
      wrk_password,
      wrk_confirmpassword,
    } = req.body;
    const checkEmail = await findEmail(wrk_email);
    try {
      if (checkEmail.rowCount == 1) throw "Email already used";
      // delete checkEmail.rows[0].password;
    } catch (error) {
      delete checkEmail.rows[0].password;
      return commonHelper.response(res, null, 403, error);
    }

    const wrk_confirmpasswordHash = bcrypt.hashSync(wrk_confirmpassword);
    const wrk_id = uuidv4();

    const schema = Joi.object().keys({
      wrk_name: Joi.required(),
      wrk_email: Joi.string().required(),
      wrk_phone: Joi.any(),
      wrk_password: Joi.string().min(3).max(15).required(),
      wrk_confirmpassword: Joi.ref("wrk_password"),
    });
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      console.log(error);
      return res.send(error.details);
    }

    const verify = "false";
    const worker_verification_id = uuidv4().toLocaleLowerCase();
    const worker_id = wrk_id;
    const token = crypto.randomBytes(64).toString("hex");
    const url = `${process.env.BASE_URL}worker/verify?id=${worker_id}&token=${token}`;

    await sendemailworker(wrk_name, wrk_email, "Verify Email", url);

    const data = {
      wrk_id,
      wrk_name,
      wrk_email,
      wrk_phone,
      wrk_password,
      wrk_confirmpasswordHash,
      verify,
    };
    createWorker(data);

    await createWorkerVerification(worker_verification_id, worker_id, token);

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

        const result = await checkWorkerVerification(queryUsersId, queryToken);

        if (result.rowCount == 0) {
          return commonHelper.response(
            res,
            null,
            403,
            "Error invalid credential verification"
          );
        } else {
          await updateAccountVerification(queryUsersId);
          await deleteWorkerVerification(queryUsersId, queryToken);
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

  updateWorker: async (req, res) => {
    try {
      const { wrk_jobdesk, wrk_dom, wrk_place, wrk_desc } = req.body;
      const wrk_id = String(req.params.id);
      const { rowCount } = await findUUID(wrk_id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      const data = {
        wrk_id,
        wrk_jobdesk,
        wrk_dom,
        wrk_place,
        wrk_desc,
      };

      updateWorker(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Update Users Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  updateAvatarWorker: async (req, res) => {
    try {
      const wrk_id = String(req.params.id);
      const { rowCount } = await findUUID(wrk_id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      let wrk_photo = null;
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        wrk_photo = result.secure_url;
      }
      const data = {
        wrk_id,
        wrk_photo,
      };

      updateAvatarWorker(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Update Users Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  // updatePasswordUsers: async (req, res) => {
  //   try {
  //     const { users_password, users_confirmpassword } = req.body;
  //     const users_id = String(req.params.id);
  //     const { rowCount } = await findUUID(users_id);
  //     if (!rowCount) {
  //       res.json({ message: "ID Not Found" });
  //     }
  //     const schema = Joi.object().keys({
  //       users_password: Joi.string().min(3).max(15),
  //       users_confirmpassword: Joi.ref("users_password"),
  //     });
  //     const { error, value } = schema.validate(req.body, {
  //       abortEarly: false,
  //     });
  //     if (error) {
  //       console.log(error);
  //       return res.send(error.details);
  //     }
  //     let users_photo = null;
  //     if (req.file) {
  //       const result = await cloudinary.uploader.upload(req.file.path);
  //       users_photo = result.secure_url;
  //     }
  //     const users_confirmpasswordHash = bcrypt.hashSync(users_confirmpassword);
  //     const data = {
  //       users_id,
  //       users_confirmpasswordHash,
  //     };

  //     updatePasswordUsers(data)
  //       .then((result) =>
  //         commonHelper.response(res, result.rows, 200, "Update Users Success")
  //       )
  //       .catch((err) => res.send(err));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },

  deleteWorker: async (req, res) => {
    try {
      const wrk_id = String(req.params.id);
      const { rowCount } = await findUUID(wrk_id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      deleteWorker(wrk_id)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Delete Users Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  loginWorker: async (req, res) => {
    const { wrk_email, wrk_confirmpassword } = req.body;
    const {
      rows: [verify],
    } = await cekWorker(wrk_email);
    if (verify.verify === "false") {
      return res.json({
        message: "worker is unverify",
      });
    }
    const {
      rows: [users],
    } = await findEmail(wrk_email);
    if (!users) {
      return res.json({ message: "Enter a valid email" });
    }
    const isValidPassword = bcrypt.compareSync(
      wrk_confirmpassword,
      users.wrk_confirmpassword
    );
    if (!isValidPassword) {
      return res.json({ message: "Wrong password" });
    }
    delete users.wrk_confirmpassword;
    const payload = {
      wrk_email: users.wrk_email,
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

module.exports = workerController;
