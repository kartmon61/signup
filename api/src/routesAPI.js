const express = require('express');
const router = express.Router();
const {checkSession, api} = require('./middlewares/api');
const common = require('./controllers/common');
const auth = require('./controllers/auth');
const user = require('./controllers/user');

const API_VERSION = '/api/v1';

router.get(`${API_VERSION}/ping`, api(common.ping));
router.post(`${API_VERSION}/signup`, api(auth.signUp));
router.post(`${API_VERSION}/login`, api(auth.login));
router.post(`${API_VERSION}/logout`, checkSession(), api(auth.logout));
router.post(`${API_VERSION}/auth`, api(auth.sendAuth));
router.post(`${API_VERSION}/auth/validation`, api(auth.verifyAuth));
router.post(`${API_VERSION}/user/reset`, api(auth.resetMyPassword));

router.post(`${API_VERSION}/user`, api(user.createUser));
router.get(`${API_VERSION}/user`, checkSession(), api(user.userInfo));
router.delete(`${API_VERSION}/user/:userNo`, checkSession(), api(user.removeUser));


module.exports = router;