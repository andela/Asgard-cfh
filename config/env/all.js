require('dotenv').config();
const path = require('path'),
  rootPath = path.normalize(`${__dirname}/../..`);

module.exports = {
  root: rootPath,
  port: process.env.PORT,
  db: process.env.MONGOHQ_URL
};
