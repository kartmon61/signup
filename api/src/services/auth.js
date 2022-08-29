const crypto = require('crypto');
const { throw400 } = require('../utils/error');
const { 
    create4DigitCode, 
    compareAuthCode, 
    saveAuthCode, 
    sendMessageService,
    checkAuthFinished 
} = require('../utils/auth');
const { phoneNumberValidator, emailValidator } = require('../utils/validator')
const userService = require('./user');

exports.login = async (session, userIdOrNameOrEmailOrNumber, password) => {
    /*
        로그인 함수
        params
        - sesssion: object
        - userIdOrNameOrEmailOrNumber: string
        - password: string
    */
    try {
        const userInfo = await userService.getUserInfoByUserIdOrEmailOrPhoneNumber(userIdOrNameOrEmailOrNumber);
        throw400(userInfo == null, '등록된 계정이 없습니다.');
        const dbUserNo = userInfo.dataValues.no;
        const dbUserID = userInfo.dataValues.userId;
        const dbPassword = userInfo.dataValues.userPassword;
        const dbSalt = userInfo.dataValues.salt;
        const hashPassword = crypto.createHash("sha512").update(password + dbSalt).digest("hex");
        throw400((dbPassword != hashPassword), '아이디 패스워드가 일치하지 않습니다.');

        if (session.userInfo) {
            return {};
        } else {
            session.userInfo = {
                userId: dbUserID,
                userNo: dbUserNo,
                authorized: true,
            }
            session.save();
            return {};
        };
    } catch (e) {
        throw e;
    }
};

exports.logout = async (session) => {
    /*
        로그아웃 함수
        params
        - session: object
    */
    try {
        await delete session.userInfo;
        return {};
    } catch (e) {
        throw e;
    }
};

exports.signUp = async (userId, userPassword, userName, userEmail, userPhoneNumber) => {
    /*
        회원가입 함수
        params
        - userId: string
        - userPassword: string
        - userName: string
        - userEmail: string
        - userPhoneNumber: string
    */
    try {
        throw400(!emailValidator(userEmail), '올바르지 않은 이메일 형식 입니다.');
        throw400(!phoneNumberValidator(userPhoneNumber), '올바르지 않은 핸드폰 번호 입니다.');
        const authValid = await checkAuthFinished(userPhoneNumber);
        throw400(!authValid, '회원 가입을 하기 전에 핸드폰 번호 인증을 해야합니다.');
        const salt = Math.round((new Date().valueOf() * Math.random())) + "";
        const hashPassword = crypto.createHash("sha512").update(userPassword + salt).digest("hex");
        await userService.creatUserInfo(userId, hashPassword, userName, userEmail, userPhoneNumber, salt);
        return {};
    } catch (e) {
        throw e;
    }
};

exports.sendAuth = async (phoneNumber) => {
    /*
        인증 번호 전송 함수
        params
        - phoneNumber: string
    */
    try {
        throw400(!phoneNumberValidator(phoneNumber), '올바르지 않은 핸드폰 번호 입니다.');
        const code = create4DigitCode();
        await saveAuthCode(phoneNumber, code);
        await sendMessageService(phoneNumber, code);
        return {};
    } catch (e) {
        throw e;
    }
}

exports.verifyAuth = async (phoneNumber, code) => {
    /*
        인증번호 검증 함수
        params
        - phoneNumber: string
        - code: int
    */
    try {
        const result = await compareAuthCode(phoneNumber, code);
        throw400(!result, '인증 번호가 잘못 되었습니다.');
        return {};
    } catch (e) {
        throw e;
    }
};

exports.resetMyPassword = async (phoneNumber, newPassword) => {
    /*
        비밀번호 초기화 함수
        params
        - phoneNumber: string
        - newPassword: string
    */
    try {
        const valid = await checkAuthFinished(phoneNumber);
        throw400(!valid, '비밀번호를 초기화 하기 위해서 핸드폰 번호 인증을 해야합니다.');
        const userInfo = await userService.getUserInfoByUserIdOrEmailOrPhoneNumber(phoneNumber);
        throw400(userInfo == null, '등록된 계정이 없습니다.');
        const salt = userInfo.dataValues.salt;
        const hashPassword = crypto.createHash("sha512").update(newPassword + salt).digest("hex");
        
        return await userService.updateUserPassword(userInfo.dataValues.no, hashPassword);
    } catch (e) {
        throw e;
    }
}
