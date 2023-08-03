const Pool = require("../config/db");

//GET ALL
const selectAllSkill = ({ limit, offset, sort, sortby }) => {
  return Pool.query(
    `SELECT * FROM skill ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

//GET SELECT USERS
const selectSkillUsers = (wrk_id) => {
  return Pool.query(`SELECT * FROM skill WHERE wrk_id = '${wrk_id}'`);
};

//DELETE SELECT USERS
const deleteSkill = (skill_id) => {
  return Pool.query(`DELETE FROM skill WHERE skill_id  = '${skill_id}'`);
};

//POST USERS
const createSkill = (data) => {
  const { skill_id, skill_name, wrk_id } = data;
  return Pool.query(`INSERT INTO skill(skill_id, skill_name, wrk_id) 
    VALUES ('${skill_id}','${skill_name}','${wrk_id}')`);
};

//PUT SELECT USERS
const updateSkill = (data) => {
  const { skill_id, skill_name } = data;
  return Pool.query(
    `UPDATE skill SET skill_name = '${skill_name}' WHERE skill_id = '${skill_id}'`
  );
};

//FIND EMAIL
const findUUID = (skill_id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM skill WHERE skill_id= '${skill_id}' `,
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

const findSkill = (skill_name, wrk_id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM skill WHERE skill_name = '${skill_name}' AND wrk_id = '${wrk_id}'`,
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

const findUser = (wrk_id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM skill WHERE wrk_id= '${wrk_id}' `,
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
  return Pool.query(`SELECT COUNT(*) FROM skill`);
};

module.exports = {
  selectAllSkill,
  selectSkillUsers,
  deleteSkill,
  createSkill,
  updateSkill,
  findUUID,
  findUser,
  findSkill,
  countData,
};
