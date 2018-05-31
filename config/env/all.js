require('dotenv').config();
const path = require('path'),
  rootPath = path.normalize(`${__dirname}/../..`);

const keys = `${rootPath}/keys.txt`;

module.exports = {
  root: rootPath,
  port: process.env.PORT,
  db: process.env.MONGOHQ_URL || 'mongodb://localhost:27017/asgard-cfh'
};
