exports.phoneNumberValidator = (number) => {
    if (/^010\d{4}\d{4}$/.test(number)) {
        return true;
    }
    return false;
}

exports.emailValidator = (email) => {
    if (/\S+@\S+\.\S+/.test(email)) {
        return true;
    }
    return false;
}