const app = require('../app');
// const syncDb = require('./sync-db');
// syncDb().then(() => {
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on ${port} port`);
});
// });
