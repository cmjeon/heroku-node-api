const {coronaInstance} = require('../utils/api.js');
const {CORONA_SVC_KEY} = process.env

const index = (req, res) => {
  res.json('Corona!');
}

const koreaBeta = async (req, res) => {
  try {
    const url = `korea/beta/?serviceKey=${CORONA_SVC_KEY}`
    const result = await coronaInstance({method: 'get', url: url})
    res.status(200).json(result.data).end();
  } catch (e) {
    console.log(e.response.data)
    return res.status(500).send('Internal Server Error');
  }
}

const koreaVaccine = async (req, res) => {
  try {
    const url = `korea/vaccine/?serviceKey=${CORONA_SVC_KEY}`
    const result = await coronaInstance({method: 'get', url: url})
    res.status(200).json(result.data).end();
  } catch (e) {
    console.log(e.response.data)
    return res.status(500).send('Internal Server Error');
  }
}

const koreaCounter = async (req, res) => {
  try {
    const url = `korea/?serviceKey=${CORONA_SVC_KEY}`
    const result = await coronaInstance({method: 'get', url: url})
    res.status(200).json(result.data).end();
  } catch (e) {
    console.log(e.response.data)
    return res.status(500).send('Internal Server Error');
  }
}

const koreaCountry = async (req, res) => {
  try {
    const url = `korea/country/new/?serviceKey=${CORONA_SVC_KEY}`
    const result = await coronaInstance({method: 'get', url: url})
    res.status(200).json(result.data).end();
  } catch (e) {
    console.log(e.response.data)
    return res.status(500).send('Internal Server Error');
  }
}

module.exports = {
  index,
  koreaBeta,
  koreaVaccine,
  koreaCounter,
  koreaCountry
}