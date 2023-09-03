const Pool = require("../config/db");

const selectAllWorker = ({ limit, offset, sort, sortby }) => {
  return Pool.query(
    `SELECT * FROM worker ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

const selectWorker = (wrk_id) => {
  return Pool.query(`SELECT * FROM worker WHERE wrk_id = '${wrk_id}'`);
};

const deleteWorker = (wrk_id) => {
  return Pool.query(`DELETE FROM worker WHERE wrk_id  = '${wrk_id}'`);
};

const createWorker = (data) => {
  const {
    wrk_id,
    wrk_name,
    wrk_email,
    wrk_phone,
    wrk_password,
    wrk_confirmpasswordHash,
    verify,
  } = data;
  return Pool.query(`INSERT INTO worker(wrk_id,wrk_name,wrk_email,wrk_phone,wrk_password,wrk_confirmpassword,verify) 
    VALUES ('${wrk_id}','${wrk_name}','${wrk_email}','${wrk_phone}','${wrk_password}','${wrk_confirmpasswordHash}','${verify}')`);
};

const createWorkerVerification = (worker_verification_id, worker_id, token) => {
  return Pool.query(
    `insert into worker_verification ( id , worker_id , token ) values ( '${worker_verification_id}' , '${worker_id}' , '${token}' )`
  );
};

const checkWorkerVerification = (queryUsersId, queryToken) => {
  return Pool.query(
    `select * from worker_verification where worker_id='${queryUsersId}' and token = '${queryToken}' `
  );
};

const cekWorker = (wrk_email) => {
  return Pool.query(
    `select verify from worker where wrk_email = '${wrk_email}' `
  );
};

const deleteWorkerVerification = (queryUsersId, queryToken) => {
  return Pool.query(
    `delete from worker_verification  where worker_id='${queryUsersId}' and token = '${queryToken}' `
  );
};

const updateAccountVerification = (queryUsersId) => {
  return Pool.query(
    `update worker set verify='true' where wrk_id='${queryUsersId}' `
  );
};

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
  createWorkerVerification,
  checkWorkerVerification,
  cekWorker,
  deleteWorkerVerification,
  updateAccountVerification,
  findUUID,
  findEmail,
  countData,
};
