const getRandomID = (length) => [...Array(length)].map(() => (~~(Math.random() * 36)).toString(36)).join('').toUpperCase();
const getRandomEmail = () => {
  var chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
  var emailString = '';
  for (var i = 0; i < 10; i++) {
    emailString += chars[Math.floor(Math.random() * chars.length)];
  }
  return emailString + '@test.com';
}
module.exports = {
  getRandomID,
  getRandomEmail
}