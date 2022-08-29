const user = require('../services/user');

exports.removeUser = async (req) => {
    const userNo = req.params.userNo;

    await user.removeUserInfo(userNo);

    return {}
};

exports.userInfo = async (req) => {
    const userNo = req.session.userInfo.userNo;
    return await user.getUserInfo(userNo);
};
