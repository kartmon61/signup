const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const SessionStore  = require('express-session-sequelize')(session.Store)
const apiRouter = require('./routesAPI');
const { sequelize } = require('./models');

const sequelizeSessionStore = new SessionStore({
  db: sequelize,
  checkExpirationInterval: 1000 * 60 * 10  // 10분
})
const sessionInfo = {
  secret: 'secret', 
  resave: false, 
  saveUninitialized: true, 
  store: sequelizeSessionStore,
  rolling: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 2 // 2시간
  }
}

app.set('port', process.env.PORT || 8080);
app.use(express.json());
app.use(cookieParser());
app.use(session(sessionInfo))
app.use('/', apiRouter);

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch(err => {
    console.error('ERROR', err);
  });

  module.exports = app;
