'use strict';
const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  host : process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username : process.env.DATABASE_USER,
  password : process.env.DATABASE_PASSWORD,
  database : process.env.DATABASE_NAME,
  dialect: 'mysql',
  logging: process.env.DATABASE_LOGGING === 'true' ? console.log : false,
});

const User = require('./user')(sequelize);

module.exports = {sequelize, User};