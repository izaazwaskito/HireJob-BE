const Pool = require("../config/db");

//GET ALL WORKER
const selectAllWorker = ({ limit, offset, sort, sortby }) => {
  return Pool.query(
    `SELECT * FROM worker ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

//GET SELECT USERS
const selectWorker = (wrk_id) => {
  return Pool.query(`SELECT * FROM worker WHERE wrk_id = '${wrk_id}'`);
};

//DELETE SELECT USERS
const deleteWorker = (wrk_id) => {
  return Pool.query(`DELETE FROM worker WHERE wrk_id  = '${wrk_id}'`);
};

//POST USERS
const createWorker = (data) => {
  const {
    wrk_id,
    wrk_name,
    wrk_email,
    wrk_phone,
    wrk_password,
    wrk_confirmpasswordHash,
  } = data;
  return Pool.query(`INSERT INTO worker(wrk_id,wrk_name,wrk_email,wrk_phone,wrk_password,wrk_confirmpassword) 
    VALUES ('${wrk_id}','${wrk_name}','${wrk_email}','${wrk_phone}','${wrk_password}',
    '${wrk_confirmpasswordHash}')`);
};

//PUT SELECT USERS
const updateWorker = (data) => {
  const { wrk_id, wrk_jobdesk, wrk_dom, wrk_place, wrk_desc } = data;
  return Pool.query(
    `UPDATE worker SET  wrk_jobdesk = '${wrk_jobdesk}', wrk_dom = '${wrk_dom}', wrk_place = '${wrk_place}', wrk_desc = '${wrk_desc}' WHERE wrk_id = '${wrk_id}'`
  );
};

const updateAvatarWorker = (data) => {
  const { wrk_id, wrk_photo } = data;
  return Pool.query(
    `UPDATE worker SET  wrk_photo = '${wrk_photo}' WHERE wrk_id = '${wrk_id}'`
  );
};

// const updatePasswordUsers = (data) => {
//   const { users_id, users_email, users_password, users_confirmpasswordHash } =
//     data;
//   return Pool.query(
//     `UPDATE users SET users_password = '${users_password}', users_confirmpassword = '${users_confirmpasswordHash}'WHERE users_id = '${users_id}'`
//   );
// };

//FIND EMAIL
const findUUID = (wrk_id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM worker WHERE wrk_id= '${wrk_id}' `,
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

const findEmail = (wrk_email) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM worker WHERE wrk_email= '${wrk_email}' `,
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

//COUNT DATA
const countData = () => {
  return Pool.query(`SELECT COUNT(*) FROM worker`);
};

module.exports = {
  selectAllWorker,
  selectWorker,
  deleteWorker,
  createWorker,
  updateWorker,
  updateAvatarWorker,
  // updatePasswordWorker,
  findUUID,
  findEmail,
  countData,
};
