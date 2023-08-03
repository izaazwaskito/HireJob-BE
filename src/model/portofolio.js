const Pool = require("../config/db");

//GET ALL
const selectAllPortofolio = ({ limit, offset, sort, sortby }) => {
  return Pool.query(
    `SELECT * FROM portofolio ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

//GET SELECT USERS
const selectPortofolioUsers = (wrk_id) => {
  return Pool.query(`SELECT * FROM portofolio WHERE wrk_id = '${wrk_id}'`);
};

//DELETE SELECT USERS
const deletePortofolio = (por_id) => {
  return Pool.query(`DELETE FROM portofolio WHERE por_id  = '${por_id}'`);
};

//POST USERS
const createPortofolio = (data) => {
  const { por_id, por_name, por_repository, por_photo, wrk_id } = data;
  return Pool.query(`INSERT INTO portofolio(por_id, por_name, por_repository, por_photo, wrk_id) 
    VALUES ('${por_id}','${por_name}','${por_repository}','${por_photo}','${wrk_id}')`);
};

//PUT SELECT USERS
const updatePortofolio = (data) => {
  const { por_id, por_name, por_repository, por_photo } = data;
  return Pool.query(
    `UPDATE portofolio SET  por_name = '${por_name}', por_repository = '${por_repository}', por_photo = '${por_photo}' WHERE por_id = '${por_id}'`
  );
};

//FIND EMAIL
const findUUID = (por_id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM portofolio WHERE por_id= '${por_id}' `,
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
      `SELECT * FROM portofolio WHERE wrk_id= '${wrk_id}' `,
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
  return Pool.query(`SELECT COUNT(*) FROM portofolio`);
};

module.exports = {
  selectAllPortofolio,
  selectPortofolioUsers,
  deletePortofolio,
  createPortofolio,
  updatePortofolio,
  findUUID,
  findUser,
  countData,
};
