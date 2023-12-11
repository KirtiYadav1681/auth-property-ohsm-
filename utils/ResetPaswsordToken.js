const crypto = require('crypto');

module.exports.generateResetToken = () => {
    return crypto.randomBytes(20).toString('hex');
}

module.exports.generateResetTokenExpiry = () => {
    const now = new Date();
    // Token expires in 5 hour
    now.setHours(now.getHours() + 5);
    return now;
}
