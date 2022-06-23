const https = require('https')
const { APIID_OPENWEATHER } = process.env

const index = (req, res) => {
  res.json('Weather!')
}

const current = (req, res) => {
  let lat = req.query.lat
  let lon = req.query.lon

  const appid = APIID_OPENWEATHER
  let mode = req.query.mode
  let units = req.query.units
  let lang = req.query.lang

  let qs = `lat=${lat}&lon=${lon}&appid=${appid}`

  if (mode) qs += `&mode=${mode}`
  if (units) qs += `&units=${units}`
  if (lang) qs += `&lang=${lang}`
  let path = `/data/2.5/weather?${qs}`
  // console.log('PATH', path);
  const options = {
    hostname: 'api.openweathermap.org',
    port: 443,
    path: path,
    method: 'GET',
  }

  https
    .get(options, (res2) => {
      // console.log(`statusCode: ${res2.statusCode}`);
      let data = ''
      res2.on('data', (chunk) => {
        data += chunk
      })
      res2.on('end', () => {
        // console.log('data', data);
        // console.log(JSON.parse(data).explanation);
        res.json(JSON.parse(data))
        res.status(200).end()
      })

      // console.log('RES2', res2);
      // res.json(res2.data);
    })
    .on('error', (err) => {
      console.log('Error: ' + err.message)
    })
  // req2.end();
  // res.status(200).end();
}

const onecall = (req, res) => {
  const lat = req.query.lat
  const lon = req.query.lon
  const appid = APIID_OPENWEATHER
  const exclude = req.query.exclude
  const units = req.query.units
  const lang = req.query.lang

  let qs = `lat=${lat}&lon=${lon}&appid=${appid}`

  if (exclude) qs += `&exclude=${exclude}`
  units ? (qs += `&units=${units}`) : (qs += `&units=metric`)
  lang ? (qs += `&lang=${lang}`) : (qs += `&lang=kr`)
  let path = `/data/2.5/onecall?${qs}`
  // console.log('PATH', path);
  const options = {
    hostname: 'api.openweathermap.org',
    port: 443,
    path: path,
    method: 'GET',
  }

  https
    .get(options, (res2) => {
      let data = ''
      res2.on('data', (chunk) => {
        data += chunk
      })
      res2.on('end', () => {
        res.json(JSON.parse(data))
        res.status(200).end()
      })
    })
    .on('error', (err) => {
      console.log('Error: ' + err.message)
    })
}

// https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=&appid=${APIKEY}&lang=kr&units=metric`

module.exports = {
  index,
  current,
  onecall,
}
