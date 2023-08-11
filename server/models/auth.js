const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}
const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}
module.exports = { generateAuthToken: generateAuthToken, getHashedPassword:getHashedPassword};