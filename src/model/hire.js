const Pool = require("../config/db");

//GET ALL
const selectAllHire = ({ limit, offset, sort, sortby }) => {
  return Pool.query(
    `SELECT * FROM hire ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

//GET SELECT USERS
const selectHireWorker = (wrk_id) => {
  return Pool.query(`SELECT * FROM hire WHERE wrk_id = '${wrk_id}'`);
};

const selectHireRecruiter = (rec_id) => {
  return Pool.query(`SELECT * FROM hire WHERE rec_id = '${rec_id}'`);
};

//DELETE SELECT USERS
const deleteHire = (hire_id) => {
  return Pool.query(`DELETE FROM hire WHERE hire_id  = '${hire_id}'`);
};

//POST USERS
const createHire = (data) => {
  const {
    hire_id,
    hire_title,
    hire_desc,
    wrk_id,
    rec_id,
    wrk_name,
    wrk_email,
    rec_compname,
  } = data;
  return Pool.query(`INSERT INTO hire(hire_id, hire_title, hire_desc,wrk_id, rec_id, wrk_name, wrk_email, rec_compname)  
    VALUES ('${hire_id}','${hire_title}','${hire_desc}','${wrk_id}','${rec_id}','${wrk_name}','${wrk_email}','${rec_compname}')`);
};

//PUT SELECT USERS
// const updateSkill = (data) => {
//   const { skill_id, skill_name } = data;
//   return Pool.query(
//     `UPDATE skill SET skill_name = '${skill_name}' WHERE skill_id = '${skill_id}'`
//   );
// };

//FIND EMAIL
const findUUID = (hire_id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM hire WHERE hire_id= '${hire_id}' `,
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

// const findSkill = (skill_name, wrk_id) => {
//   return new Promise((resolve, reject) =>
//     Pool.query(
//       `SELECT * FROM skill WHERE skill_name = '${skill_name}' AND wrk_id = '${wrk_id}'`,
//       (error, result) => {
//         if (!error) {
//           resolve(result);
//         } else {
//           reject(error);
//         }
//       }
//     )
//   );
// };

// const findUser = (wrk_id) => {
//   return new Promise((resolve, reject) =>
//     Pool.query(
//       `SELECT * FROM skill WHERE wrk_id= '${wrk_id}' `,
//       (error, result) => {
//         if (!error) {
//           resolve(result);
//         } else {
//           reject(error);
//         }
//       }
//     )
//   );
// };

//COUNT DATA
const countData = () => {
  return Pool.query(`SELECT COUNT(*) FROM hire`);
};

module.exports = {
  selectAllHire,
  selectHireWorker,
  selectHireRecruiter,
  deleteHire,
  createHire,
  findUUID,
  countData,
};
