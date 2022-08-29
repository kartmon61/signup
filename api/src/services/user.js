const Op = require('Sequelize').Op;
const models = require('../models');

exports.creatUserInfo = async (userId, userPassword, userName, userEmail, userPhoneNumber, salt) => {
    /*
        유저 생성 함수
        params
        - userId: string
        - userPassword: string
        - userName: string
        - userEmail: string
        - userPhoneNumber: string
        - salt: string
        return
        - user
    */
    const user = await models.User.create({
        userId: userId,
        userPassword: userPassword,
        userEmail: userEmail,
        salt: salt,
        userName: userName,
        userPhoneNumber: userPhoneNumber,
        regDtt: models.sequelize.literal('CURRENT_TIMESTAMP'),
        modDtt: models.sequelize.literal('CURRENT_TIMESTAMP')
    })
    return user.dataValues;
};

exports.getUserInfo = async (userNo) => {
    /*
        유저 번호로 특정 유저 정보 가져오는 함수
        params
        - userNo: int
        return
        - user ('no', 'userId', 'userName', 'userEmail', 'userPhoneNumber')
    */
    const user = await models.User.findOne({
        where: {
            no: userNo
        },
        attributes: ['no', 'userId', 'userName', 'userEmail', 'userPhoneNumber']
    });
    return user.dataValues;
};

exports.getUserInfoByUserIdOrEmailOrPhoneNumber = async (userIdOrNameOrEmailOrNumber) => {
    /*
        유저 아이디나 이메일, 핸드폰 번호로 특정 유저 정보 가져오는 함수
        params
        - userIdOrNameOrEmailOrNumber: string
        return
        - user ('no', 'userId', 'userName', 'userEmail', 'userPassword', 'userPhoneNumber', 'salt')
    */
    const user = await models.User.findOne({
        where: {
            [Op.or] : [
                {
                    userId: userIdOrNameOrEmailOrNumber
                },
                {
                    userName: userIdOrNameOrEmailOrNumber
                },
                {
                    userEmail: userIdOrNameOrEmailOrNumber
                },
                {
                    userPhoneNumber: userIdOrNameOrEmailOrNumber
                }
            ]
        },
        attributes: ['no', 'userId', 'userName', 'userEmail', 'userPassword', 'userPhoneNumber', 'salt']
    });
    return user;
};

exports.updateUserPassword = async (userNo, userPassword) => {
    /*
        유저 번호로 유저 비밀번호 업데이트하는 함수
        params
        - userNo: int
        - userPassword: string
    */
        await models.User.update({
            userPassword: userPassword,
            modDtt: models.sequelize.literal('CURRENT_TIMESTAMP'),
        },
        {
            where : {no: userNo}
        });
        return {};
}

exports.removeUserInfo = async (userNo) => {
    /*
        유저 번호로 유저 삭제하는 함수
        params
        - userNo: int
    */
    await models.User.destroy({where : {no: userNo}});
    return {};
};
