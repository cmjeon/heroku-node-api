const { coronaInstance } = require('../utils/api.js');
const { CORONA_SVC_KEY } = process.env

const index = (req, res) => {
  res.json('Corona!');
}

const koreaBeta = async (req, res) => {
  try {
    const serviceKey = CORONA_SVC_KEY
    const url =  `korea/beta/?serviceKey=${serviceKey}`

    const result = await coronaInstance({
      method : 'get',
      url : url
    })

    res.status(200).json(result.data).end();
  } catch(e) {
    console.log(e)
    return res.status(500).send('Internal Server Error');
  }
}

const koreaVaccine = async (req, res) => {
  res.json('Corona!');
}

const koreaCounter = async (req, res) => {
  res.json('Corona!');
}

const koreaCountry = async (req, res) => {
  res.json('Corona!');
}

module.exports = {
  index,
  koreaBeta,
  koreaVaccine,
  koreaCounter,
  koreaCountry
}