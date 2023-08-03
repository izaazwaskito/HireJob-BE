const Pool = require("../config/db");

//GET ALL Experience
const selectAllExperience = ({ limit, offset, sort, sortby }) => {
  return Pool.query(
    `SELECT * FROM experience ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

//GET SELECT USERS
const selectExperience = (exp_id) => {
  return Pool.query(`SELECT * FROM experience  WHERE exp_id = '${exp_id}'`);
};

const selectExperienceUsers = (wrk_id) => {
  return Pool.query(`SELECT * FROM experience WHERE wrk_id = '${wrk_id}'`);
};

//DELETE SELECT USERS
const deleteExperience = (exp_id) => {
  return Pool.query(`DELETE FROM experience WHERE exp_id  = '${exp_id}'`);
};

//POST USERS
const createExperience = (data) => {
  const {
    exp_id,
    exp_position,
    exp_compname,
    exp_datefrom,
    exp_dateuntil,
    exp_desc,
    wrk_id,
  } = data;
  return Pool.query(`INSERT INTO experience(exp_id,exp_position,exp_compname,exp_datefrom,exp_dateuntil,exp_desc,wrk_id) 
    VALUES ('${exp_id}','${exp_position}','${exp_compname}','${exp_datefrom}','${exp_dateuntil}','${exp_desc}','${wrk_id}')`);
};

//PUT SELECT USERS
const updateExperience = (data) => {
  const {
    exp_id,
    exp_position,
    exp_compname,
    exp_datefrom,
    exp_dateuntil,
    exp_desc,
  } = data;
  return Pool.query(
    `UPDATE experience SET  exp_position = '${exp_position}', exp_compname = '${exp_compname}', exp_datefrom = '${exp_datefrom}', exp_dateuntil = '${exp_dateuntil}', exp_desc = '${exp_desc}' WHERE exp_id = '${exp_id}'`
  );
};

//FIND EMAIL
const findUUID = (exp_id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM experience WHERE exp_id= '${exp_id}' `,
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
      `SELECT * FROM experience WHERE wrk_id= '${wrk_id}' `,
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
  return Pool.query(`SELECT COUNT(*) FROM experience`);
};

module.exports = {
  selectAllExperience,
  selectExperience,
  selectExperienceUsers,
  deleteExperience,
  createExperience,
  updateExperience,
  findUUID,
  findUser,
  countData,
};
