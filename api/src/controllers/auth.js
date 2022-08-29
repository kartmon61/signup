const service = require('../services/auth')

exports.login = async (req, res) => {
    const userIdOrNameOrEmailOrNumber = req.body.userIdOrNameOrEmailOrNumber;
    const password = req.body.password;
    const session = req.session;

    return await service.login(session, userIdOrNameOrEmailOrNumber, password);
}

exports.logout = async (req, res) => {
    const session = req.session;
    if (session.userInfo) {
        return await service.logout(session);
    } else {
        return {};
    }
}

exports.signUp = async (req, res) => {
    const userId = req.body.userId;
    const userPassword = req.body.userPassword;
    const userName = req.body.userName;
    const userEmail = req.body.userEmail;
    const userPhoneNumber = req.body.userPhoneNumber;
    
    return await service.signUp(userId, userPassword, userName, userEmail, userPhoneNumber);
}

exports.sendAuth = async (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    return await service.sendAuth(phoneNumber);
}

exports.verifyAuth = async (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    const code = req.body.code;
    return await service.verifyAuth(phoneNumber, code);
}

exports.resetMyPassword = async (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    const newPassword = req.body.newPassword;
    return await service.resetMyPassword(phoneNumber, newPassword);
}