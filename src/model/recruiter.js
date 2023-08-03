const Pool = require("../config/db");

// GET ALL WORKER
const selectAllRecruiter = ({ limit, offset, sort, sortby }) => {
  return Pool.query(
    `SELECT * FROM recruiter ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

// GET SELECT USERS
const selectRecruiter = (rec_id) => {
  return Pool.query(`SELECT * FROM recruiter WHERE rec_id = '${rec_id}'`);
};

// DELETE SELECT USERS
const deleteRecruiter = (rec_id) => {
  return Pool.query(`DELETE FROM recruiter WHERE rec_id  = '${rec_id}'`);
};

// POST USERS
const createRecruiter = (data) => {
  const {
    rec_id,
    rec_name,
    rec_email,
    rec_compname,
    rec_position,
    rec_phone,
    rec_password,
    rec_confirmpasswordHash,
  } = data;
  return Pool.query(`INSERT INTO recruiter(rec_id,rec_compname,rec_phone,rec_name,rec_email,rec_position,rec_password,rec_confirmpassword) 
    VALUES ('${rec_id}','${rec_compname}','${rec_phone}','${rec_name}','${rec_email}','${rec_position}','${rec_password}','${rec_confirmpasswordHash}')`);
};

// PUT SELECT USERS
const updateRecruiter = (data) => {
  const {
    rec_id,
    rec_jobfield,
    rec_province,
    rec_city,
    rec_desc,
    rec_emailcomp,
    rec_linkedin,
  } = data;
  return Pool.query(
    `UPDATE recruiter SET  rec_jobfield = '${rec_jobfield}', rec_province = '${rec_province}', rec_city = '${rec_city}', rec_desc = '${rec_desc}', rec_emailcomp = '${rec_emailcomp}', rec_linkedin = '${rec_linkedin}' WHERE rec_id = '${rec_id}'`
  );
};

const updateAvatarRecruiter = (data) => {
  const { rec_id, rec_photo } = data;
  return Pool.query(
    `UPDATE recruiter SET  rec_photo = '${rec_photo}' WHERE rec_id = '${rec_id}'`
  );
};

// FIND EMAIL
const findUUID = (rec_id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM recruiter WHERE rec_id= '${rec_id}' `,
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    )
  );
};

const findEmail = (rec_email) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM recruiter WHERE rec_email= '${rec_email}' `,
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    )
  );
};

// COUNT DATA
const countData = () => {
  return Pool.query(`SELECT COUNT(*) FROM recruiter`);
};

module.exports = {
  selectAllRecruiter,
  selectRecruiter,
  deleteRecruiter,
  createRecruiter,
  updateRecruiter,
  updateAvatarRecruiter,
  findUUID,
  findEmail,
  countData,
};
