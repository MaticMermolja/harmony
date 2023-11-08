const crypto = require('crypto');

exports.hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('base64');
    const hash = crypto.createHmac('sha512', salt)
                     .update(password)
                     .digest("base64");
    return salt + "$" + hash;
};
