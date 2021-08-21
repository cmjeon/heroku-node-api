const getRandomID = (length) => [...Array(length)].map(() => (~~(Math.random() * 36)).toString(36)).join('').toUpperCase();

const getRandomEmail = () => {
  var chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
  var emailString = '';
  for (var i = 0; i < 10; i++) {
    emailString += chars[Math.floor(Math.random() * chars.length)];
  }
  return emailString + '@test.com';
}

const getTodayDateWithHypen = () => {
  let today = new Date();
  let todayDateString = today.getUTCFullYear() + "-" + ("0" + (today.getUTCMonth() + 1)).slice(-2) + "-" + ("0" + today.getUTCDate()).slice(-2);
  // console.log(todayDateString);
  return todayDateString;
}

const getNowTime = () => {
  var nowTime = new Date();
  var hh = String(nowTime.getHours()).padStart(2, '0') + ':';
  var mm = String(nowTime.getMinutes()).padStart(2, '0') + ':';
  var ss = String(nowTime.getSeconds()).padStart(2, '0') + ':';
  var mills = String(nowTime.getMilliseconds()).padStart(3, '0');

  nowTime = hh + mm + ss + mills
  return nowTime;
}

module.exports = {
  getRandomID,
  getRandomEmail,
  getTodayDateWithHypen,
  getNowTime
}