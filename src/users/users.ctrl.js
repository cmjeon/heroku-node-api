const { pool } = require('../postgresql/postgresql');

const list = async (req, res) => {
  try {
    req.query.limit = req.query.limit || 10;
    const limit = parseInt(req.query.limit, 10);
    if (Number.isNaN(limit)) {
      return res.status(400).end();
    }
    const { rows } = await pool.query(`SELECT USER_ID, EMAIL, NAME, PROFILE FROM USER_BASE_INFO limit ${limit}`);
    res.json(rows);
    return res.status(200).end();
  } catch (e) {
    return res.status(500).send('Internal Server Error');
  }
}

const show = async (req, res) => {
  try {
    if (!req.headers.userid) {
      return res.status(403).end();
    }
    const id = req.params.id;
    if (!id) {
      return res.status(400).end();
    }
    const { rows } = await pool.query(`SELECT USER_ID, EMAIL, NAME, PROFILE FROM USER_BASE_INFO WHERE USER_ID = '${id}'`);
    const user = rows[0];
    if (!user) return res.status(404).end();
    res.json(user);
    return res.status(200).end();
  } catch (e) {
    console.log(e);
    return res.status(500).send('Internal Server Error');
  }
}

const destroy = async (req, res) => {
  try {
    const id = req.params.id;

    const {rows} = await pool.query(`DELETE FROM USER_BASE_INFO WHERE USER_ID = '${id}'`)
    console.log('rows', rows);
    if (!rows) {
      return res.status(500).send('Internal Server Error');
    }
    return res.status(204).end();
  } catch (e) {
    console.log(e);
    return res.status(500).send('Internal Server Error');
  }
}

module.exports = {
  list,
  show,
  destroy
}